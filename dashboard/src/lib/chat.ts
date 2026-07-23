"use server"

import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { organizationMembers } from '../../db/schema';
import { executeTool, TOOL_DECLARATIONS } from './chat-tools';

const MODEL = 'gemini-2.5-flash';
const MAX_TOOL_ROUNDS = 4;

const SYSTEM_INSTRUCTION = `You are the Run Intelligence assistant inside a QA test-automation dashboard.
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

async function callGemini(contents: any[]): Promise<any> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    }),
  });
  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (!res.ok) throw new Error(`Gemini request failed (${res.status}): ${await res.text()}`);
  return res.json();
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

    const contents: any[] = [
      ...history.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const toolCalls: ToolCallRecord[] = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const data = await callGemini(contents);
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
