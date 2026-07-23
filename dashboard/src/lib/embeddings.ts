// Minimal embedding client — deliberately not a multi-provider abstraction (unlike the
// litellm-based POC) since this dashboard only ever needs one embedding call site (the
// embed-failures cron). Picks whichever provider has a key configured; OpenAI wins if both are set.

const OPENAI_MODEL = 'text-embedding-3-small'; // 1536 dims natively — matches test_failure_embeddings.embedding
const GEMINI_MODEL = 'gemini-embedding-001'; // 3072 dims natively, requested down to 1536 via outputDimensionality
const VECTOR_DIMENSIONS = 1536;

export const EMBEDDING_MODEL = process.env.OPENAI_API_KEY
  ? OPENAI_MODEL
  : process.env.GEMINI_API_KEY
    ? GEMINI_MODEL
    : null;

/** Throws if no provider is configured — callers should check EMBEDDING_MODEL first if they want to skip gracefully. */
export async function embedText(text: string): Promise<number[]> {
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: OPENAI_MODEL, input: text }),
    });
    if (!res.ok) throw new Error(`OpenAI embeddings request failed (${res.status}): ${await res.text()}`);
    const data = await res.json();
    return data.data[0].embedding as number[];
  }

  if (process.env.GEMINI_API_KEY) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: { parts: [{ text }] }, outputDimensionality: VECTOR_DIMENSIONS }),
      },
    );
    if (!res.ok) throw new Error(`Gemini embeddings request failed (${res.status}): ${await res.text()}`);
    const data = await res.json();
    return data.embedding.values as number[];
  }

  throw new Error('No embedding provider configured (set OPENAI_API_KEY or GEMINI_API_KEY)');
}
