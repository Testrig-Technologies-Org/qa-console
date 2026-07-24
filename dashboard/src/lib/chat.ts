"use server"

import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '../../db';
import { chatFeedback, chatMessages, llmUsage, organizationMembers, pinnedCharts, projects } from '../../db/schema';
import { executeTool, TOOL_DECLARATIONS } from './chat-tools';

const MODEL = 'gemini-2.5-flash';
const MAX_TOOL_ROUNDS = 4;
const MAX_RETRIES_PER_CALL = 1; // one retry on a transient 429 — does nothing for an exhausted daily quota, only per-minute bursts
const RETRY_DELAY_MS = 3000;
const RECENT_FEEDBACK_LIMIT = 5;
const GEMINI_FETCH_TIMEOUT_MS = 20000; // fetch() has no default timeout — without this, a stalled connection hangs the chat forever
const TOOL_EXECUTION_TIMEOUT_MS = 15000; // TiDB Serverless connections can stall with no error, just silence — a DB call needs the same timeout treatment as the Gemini fetch above, or the whole turn hangs with no way out
const OVERALL_BUDGET_MS = 60000; // hard ceiling across all rounds, so a slow-but-not-quite-timing-out pattern can't add up to an effectively infinite wait

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`TIMED_OUT_${label}`)), ms)),
  ]);
}

const BASE_SYSTEM_INSTRUCTION = `You are the Run Intelligence assistant inside a QA test-automation dashboard.
You answer questions about a single organization's test runs, builds, and failures.

Rules:
- Only state facts returned by your tool calls. Never invent project names, build IDs, test names, or numbers.
- If a tool returns an error or empty data, say so plainly instead of guessing.
- If a project name the user mentions doesn't resolve, call list_projects and suggest close matches.
- Keep answers concise and concrete — lead with the number/fact, minimal preamble.
- Data is already scoped to the caller's organization; never ask the user to confirm identity or access.
- For requests to visualize, chart, graph, or plot anything, call get_chart_data with the metric/group_by
  that best matches the request. group_by=date is ONLY for an explicit trend/over-time request (e.g.
  "trend over time", "pass rate this week", "failures per day") — it aggregates ALL matching tests into
  one bucket per date, so a single-day result collapses into one bar showing one combined number, never
  individual tests. Use group_by=test whenever the request is about seeing multiple individual tests side
  by side rather than a trend — this includes phrasing like "bar graph for all failed tests", "each test",
  "every test", "per test", "individual test(s)", "which tests are slow", "time taken for [each/all] failed
  tests", or any request naming a plural "tests" as the thing being charted without a date/time-series
  angle. Other group_by values: "by browser/spec file/project" → that group_by; "passed but slow" →
  metric=avg_duration, status_filter=passed. If the user names a status (passed/failed/skipped), that
  status MUST go in status_filter — never omit it or use the wrong one. Before calling, ask yourself: will
  each bar in the result represent one test, or one date/browser/project? If the user said "tests" (plural,
  as individual items) and didn't ask for a trend, it must be group_by=test.
  The dashboard renders the result as an actual chart automatically, so once you have it, reply with just a
  short one-sentence caption — and that caption's wording (metric/status/scope) must exactly match the
  status_filter and metric you actually called, not what you intended to call.
- For "what's the status of test X", "is test Y passing", "find tests with Z in the name", or "how many
  tests are in spec/file W", call search_tests — it returns each matching test's actual current status by
  name, unlike get_failing_tests (failures only) or get_chart_data (aggregates only, no individual test
  names/status back). For a "how many" question, use the response's count field (the true total), not the
  length of its tests list (which is capped by limit).
- Both search_tests and get_failing_tests return a count field alongside their (limit-capped) list — count
  is always the true total that matched, regardless of limit. For "how many failing tests", "total failed
  tests", or similar totals, state count. If the user asks for a specific number of failing tests (e.g.
  "top 5 failing tests", "give me 20 failed tests"), pass that number as get_failing_tests' limit so the
  returned list has exactly that many — but still mention count in your reply if it differs from what was
  asked for (e.g. "here are 5 of the 23 currently failing tests").`;

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface ToolCallRecord {
  name: string;
  args: Record<string, any>;
  result: any;
}

async function callGemini(contents: any[], systemInstruction: string, organizationId: string, userId: string): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES_PER_CALL; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), GEMINI_FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name === 'AbortError') throw new Error('TIMED_OUT');
      throw e;
    } finally {
      clearTimeout(timeout);
    }

    if (res.status === 429) {
      lastError = new Error('RATE_LIMITED');
      if (attempt < MAX_RETRIES_PER_CALL) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      throw lastError;
    }
    if (!res.ok) throw new Error(`Gemini request failed (${res.status}): ${await res.text()}`);

    const data = await res.json();
    const usage = data.usageMetadata;
    if (usage) {
      // Best-effort — a failed insert here should never break the chat response itself.
      db.insert(llmUsage).values({
        organizationId,
        userId,
        model: MODEL,
        purpose: 'chat',
        promptTokens: usage.promptTokenCount || 0,
        candidateTokens: usage.candidatesTokenCount || 0,
        totalTokens: usage.totalTokenCount || 0,
      }).catch((e: any) => console.error('llmUsage insert failed:', e.message));
    }
    return data;
  }

  throw lastError;
}

async function buildSystemInstruction(organizationId: string): Promise<string> {
  // Best-effort — the feedback-hints lookup is a nice-to-have, not something that should be able
  // to hang or break the whole chat if the DB stalls.
  let recentNegative: { question: string; comment: string | null }[] = [];
  try {
    recentNegative = await withTimeout(
      db.query.chatFeedback.findMany({
        where: and(eq(chatFeedback.organizationId, organizationId), eq(chatFeedback.rating, 'down')),
        orderBy: (f, { desc }) => [desc(f.createdAt)],
        limit: RECENT_FEEDBACK_LIMIT,
      }),
      TOOL_EXECUTION_TIMEOUT_MS,
      'chat_feedback_lookup',
    );
  } catch (e: any) {
    console.error('buildSystemInstruction: feedback lookup failed/timed out:', e.message);
  }

  if (recentNegative.length === 0) return BASE_SYSTEM_INSTRUCTION;

  const hints = recentNegative
    .map((f) => `- Q: "${f.question}" got a bad answer${f.comment ? ` (feedback: "${f.comment}")` : ''} — don't repeat that mistake.`)
    .join('\n');

  return `${BASE_SYSTEM_INSTRUCTION}\n\nKnown issues from recent user feedback — avoid repeating these:\n${hints}`;
}

/**
 * Run Intelligence chat. The model can only act through the curated, org-scoped functions in
 * chat-tools.ts — it never generates or executes SQL itself, which is what keeps this safe
 * against prompt-injection-driven cross-tenant access or destructive queries.
 */
export async function askIntelligence(question: string, history: ChatMessage[] = [], projectId?: number): Promise<{ success: boolean; text?: string; toolCalls?: ToolCallRecord[]; error?: string }> {
  if (!process.env.GEMINI_API_KEY) return { success: false, error: 'No LLM provider configured' };
  if (!question?.trim()) return { success: false, error: 'Empty question' };

  // Best-effort, fire-and-forget — persisting history should never slow down or break the chat
  // response itself (same reasoning as the llmUsage insert in callGemini above). A no-op until
  // userId/membership are resolved, so the catch block below can call it unconditionally even if
  // the failure happened before that point.
  let persist: (msg: { role: 'user' | 'assistant'; text: string; question?: string; toolCalls?: ToolCallRecord[]; error?: boolean }) => void = () => {};

  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const membership = await withTimeout(
      db.query.organizationMembers.findFirst({ where: eq(organizationMembers.userId, userId) }),
      TOOL_EXECUTION_TIMEOUT_MS,
      'membership_lookup',
    );
    if (!membership) return { success: false, error: 'No organization found' };

    persist = (msg) => {
      db.insert(chatMessages).values({
        organizationId: membership.organizationId,
        projectId: projectId ?? null,
        userId,
        role: msg.role,
        text: msg.text,
        question: msg.question ?? null,
        toolCalls: msg.toolCalls ?? null,
        error: msg.error ? 1 : 0,
      }).catch((e: any) => console.error('chatMessages insert failed:', e.message));
    };
    persist({ role: 'user', text: question });

    const systemInstruction = await buildSystemInstruction(membership.organizationId);

    const contents: any[] = [
      ...history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const toolCalls: ToolCallRecord[] = [];
    const startedAt = Date.now();

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      if (Date.now() - startedAt > OVERALL_BUDGET_MS) throw new Error('TIMED_OUT');
      const data = await callGemini(contents, systemInstruction, membership.organizationId, userId);
      const parts = data.candidates?.[0]?.content?.parts || [];
      const functionCallParts = parts.filter((p: any) => p.functionCall);

      if (functionCallParts.length === 0) {
        const text = parts.map((p: any) => p.text).filter(Boolean).join('\n').trim() || "I couldn't find an answer to that.";
        persist({ role: 'assistant', text, question, toolCalls });
        return { success: true, text, toolCalls };
      }

      contents.push({ role: 'model', parts });

      const functionResponseParts = [];
      for (const p of functionCallParts) {
        const { name, args } = p.functionCall;
        let result: any;
        try {
          result = await withTimeout(executeTool(name, args || {}, membership.organizationId), TOOL_EXECUTION_TIMEOUT_MS, name);
        } catch {
          // A stalled DB call shouldn't hang the whole turn — surface it as a tool error so the
          // model (and system prompt's "say so plainly" rule) can tell the user this one query
          // failed, instead of the chat just sitting on "Thinking..." forever.
          result = { error: 'This query timed out — the database may be slow right now. Try again in a moment.' };
        }
        toolCalls.push({ name, args, result });
        functionResponseParts.push({ functionResponse: { name, response: result } });
      }
      contents.push({ role: 'user', parts: functionResponseParts });
    }

    const text = "That took more steps than I'm allowed — try narrowing the question.";
    persist({ role: 'assistant', text, question, toolCalls });
    return { success: true, text, toolCalls };
  } catch (e: any) {
    let errorText: string;
    if (e.message === 'RATE_LIMITED') {
      errorText = "Hit the LLM provider's rate limit — try again in a bit.";
    } else if (e.message === 'TIMED_OUT' || e.message?.startsWith('TIMED_OUT_')) {
      errorText = 'That took too long and timed out — try again, or narrow the question.';
    } else {
      console.error('❌ askIntelligence error:', e.message);
      errorText = e.message || 'Failed to get an answer';
    }
    persist({ role: 'assistant', text: errorText, question, error: true });
    return { success: false, error: errorText };
  }
}

const CHAT_HISTORY_LIMIT = 50;

/** Loads this user's persisted Ask_Intelligence conversation for a project, oldest first, so the chat can rehydrate instead of resetting on every page load. */
export async function getChatHistory(projectId?: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false as const, error: 'No organization found' };

    const rows = await db.query.chatMessages.findMany({
      where: and(
        eq(chatMessages.organizationId, membership.organizationId),
        eq(chatMessages.userId, userId),
        projectId ? eq(chatMessages.projectId, projectId) : undefined,
      ),
      orderBy: (m, { desc }) => [desc(m.createdAt)],
      limit: CHAT_HISTORY_LIMIT,
    });

    const messages = rows.reverse().map((r) => ({
      role: r.role as 'user' | 'assistant',
      text: r.text,
      question: r.question ?? undefined,
      toolCalls: (r.toolCalls as ToolCallRecord[] | null) ?? undefined,
      error: r.error === 1 || undefined,
    }));

    return { success: true as const, messages };
  } catch (e: any) {
    console.error('❌ getChatHistory error:', e.message);
    return { success: false as const, error: 'Failed to load chat history' };
  }
}

/** Thumbs up/down on an assistant answer. Recent 'down' feedback gets pulled back into future system prompts. */
export async function submitChatFeedback(question: string, answer: string, rating: 'up' | 'down', comment?: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false, error: 'No organization found' };

    await db.insert(chatFeedback).values({
      organizationId: membership.organizationId,
      userId,
      question,
      answer,
      rating,
      comment: comment || null,
    });

    return { success: true };
  } catch (e: any) {
    console.error('❌ submitChatFeedback error:', e.message);
    return { success: false, error: 'Failed to save feedback' };
  }
}

/** Token usage totals for the org's Run Intelligence chat, over a recent window. */
export async function getTokenUsageStats(days = 7) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false as const, error: 'No organization found' };

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await db.query.llmUsage.findMany({
      where: and(eq(llmUsage.organizationId, membership.organizationId), gte(llmUsage.createdAt, cutoff)),
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc.requests++;
        acc.promptTokens += r.promptTokens;
        acc.candidateTokens += r.candidateTokens;
        acc.totalTokens += r.totalTokens;
        return acc;
      },
      { requests: 0, promptTokens: 0, candidateTokens: 0, totalTokens: 0 },
    );

    return { success: true as const, windowDays: days, ...totals };
  } catch (e: any) {
    console.error('❌ getTokenUsageStats error:', e.message);
    return { success: false as const, error: 'Failed to fetch token usage' };
  }
}

/** Pins a chat-generated chart onto the project's Run Intelligence dashboard — stores the query args, not a snapshot, so it re-runs live on every load. */
export async function pinChart(projectId: number, title: string, toolName: string, args: Record<string, any>) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const project = await db.query.projects.findFirst({ where: eq(projects.id, projectId) });
    if (!project) return { success: false, error: 'Project not found' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership || membership.organizationId !== project.organizationId) {
      return { success: false, error: 'Unauthorized' };
    }

    const res = await db.insert(pinnedCharts).values({
      organizationId: project.organizationId,
      projectId,
      userId,
      title: title.slice(0, 255) || 'Untitled chart',
      toolName,
      args,
    });
    const insertedId = (res as any).lastInsertId || (res as any)[0]?.insertId;

    return { success: true, id: insertedId };
  } catch (e: any) {
    console.error('❌ pinChart error:', e.message);
    return { success: false, error: 'Failed to pin chart' };
  }
}

/** Unpins a chart from the dashboard. */
export async function unpinChart(chartId: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false, error: 'No organization found' };

    await db.delete(pinnedCharts).where(and(eq(pinnedCharts.id, chartId), eq(pinnedCharts.organizationId, membership.organizationId)));
    return { success: true };
  } catch (e: any) {
    console.error('❌ unpinChart error:', e.message);
    return { success: false, error: 'Failed to unpin chart' };
  }
}

/** Lists a project's pinned charts, re-running each one's query live rather than serving a stale snapshot. */
export async function getPinnedCharts(projectId: number) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false as const, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false as const, error: 'No organization found' };

    const pins = await db.query.pinnedCharts.findMany({
      where: and(eq(pinnedCharts.projectId, projectId), eq(pinnedCharts.organizationId, membership.organizationId)),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    });

    const charts = await Promise.all(
      pins.map(async (pin) => {
        let result: any;
        try {
          result = await withTimeout(
            executeTool(pin.toolName, pin.args as Record<string, any>, membership.organizationId),
            TOOL_EXECUTION_TIMEOUT_MS,
            pin.toolName,
          );
        } catch {
          result = { error: 'This chart timed out refreshing — the database may be slow right now.' };
        }
        return { id: pin.id, title: pin.title, name: pin.toolName, args: pin.args as Record<string, any>, result };
      }),
    );

    return { success: true as const, charts };
  } catch (e: any) {
    console.error('❌ getPinnedCharts error:', e.message);
    return { success: false as const, error: 'Failed to fetch pinned charts' };
  }
}
