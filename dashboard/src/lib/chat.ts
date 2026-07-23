"use server"

import { auth } from '@clerk/nextjs/server';
import { and, desc, eq, gte } from 'drizzle-orm';
import { db } from '../../db';
import { chatFeedback, llmUsage, organizationMembers } from '../../db/schema';
import { executeTool, TOOL_DECLARATIONS } from './chat-tools';

const MODEL = 'gemini-2.5-flash';
const MAX_TOOL_ROUNDS = 4;
const MAX_RETRIES_PER_CALL = 1; // one retry on a transient 429 — does nothing for an exhausted daily quota, only per-minute bursts
const RETRY_DELAY_MS = 3000;
const RECENT_FEEDBACK_LIMIT = 5;

const BASE_SYSTEM_INSTRUCTION = `You are the Run Intelligence assistant inside a QA test-automation dashboard.
You answer questions about a single organization's test runs, builds, and failures.

Rules:
- Only state facts returned by your tool calls. Never invent project names, build IDs, test names, or numbers.
- If a tool returns an error or empty data, say so plainly instead of guessing.
- If a project name the user mentions doesn't resolve, call list_projects and suggest close matches.
- Keep answers concise and concrete — lead with the number/fact, minimal preamble.
- Data is already scoped to the caller's organization; never ask the user to confirm identity or access.
- For requests to visualize, chart, graph, or show a trend, call get_pass_rate_trend or get_failure_breakdown
  as appropriate. The dashboard renders that tool's data as an actual chart automatically, so once you have
  the result, reply with just a short one-sentence caption — don't describe the data point-by-point in prose.`;

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
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
    });

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
  const recentNegative = await db.query.chatFeedback.findMany({
    where: and(eq(chatFeedback.organizationId, organizationId), eq(chatFeedback.rating, 'down')),
    orderBy: (f, { desc }) => [desc(f.createdAt)],
    limit: RECENT_FEEDBACK_LIMIT,
  });

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
export async function askIntelligence(question: string, history: ChatMessage[] = []): Promise<{ success: boolean; text?: string; toolCalls?: ToolCallRecord[]; error?: string }> {
  if (!process.env.GEMINI_API_KEY) return { success: false, error: 'No LLM provider configured' };
  if (!question?.trim()) return { success: false, error: 'Empty question' };

  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const membership = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });
    if (!membership) return { success: false, error: 'No organization found' };

    const systemInstruction = await buildSystemInstruction(membership.organizationId);

    const contents: any[] = [
      ...history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const toolCalls: ToolCallRecord[] = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const data = await callGemini(contents, systemInstruction, membership.organizationId, userId);
      const parts = data.candidates?.[0]?.content?.parts || [];
      const functionCallParts = parts.filter((p: any) => p.functionCall);

      if (functionCallParts.length === 0) {
        const text = parts.map((p: any) => p.text).filter(Boolean).join('\n').trim();
        return { success: true, text: text || "I couldn't find an answer to that.", toolCalls };
      }

      contents.push({ role: 'model', parts });

      const functionResponseParts = [];
      for (const p of functionCallParts) {
        const { name, args } = p.functionCall;
        const result = await executeTool(name, args || {}, membership.organizationId);
        toolCalls.push({ name, args, result });
        functionResponseParts.push({ functionResponse: { name, response: result } });
      }
      contents.push({ role: 'user', parts: functionResponseParts });
    }

    return { success: true, text: "That took more steps than I'm allowed — try narrowing the question.", toolCalls };
  } catch (e: any) {
    if (e.message === 'RATE_LIMITED') {
      return { success: false, error: "Hit the LLM provider's rate limit — try again in a bit." };
    }
    console.error('❌ askIntelligence error:', e.message);
    return { success: false, error: e.message || 'Failed to get an answer' };
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
