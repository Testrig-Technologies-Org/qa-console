import { NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../../../../../db';
import { testFailureEmbeddings } from '../../../../../db/schema';
import { EMBEDDING_MODEL, embedText } from '../../../../lib/embeddings';

const BATCH_SIZE = 25; // safety cap per run; remaining pending rows get caught on the next run

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!EMBEDDING_MODEL) {
    return NextResponse.json({ success: true, skipped: true, reason: 'No embedding provider configured' });
  }

  const pending = await db.query.testFailureEmbeddings.findMany({
    where: and(isNull(testFailureEmbeddings.embeddingModel), isNull(testFailureEmbeddings.embedding)),
    limit: BATCH_SIZE,
  });

  let embedded = 0;
  let failed = 0;

  for (const row of pending) {
    try {
      const embedding = await embedText(row.signature);
      await db
        .update(testFailureEmbeddings)
        .set({ embedding, embeddingModel: EMBEDDING_MODEL })
        .where(eq(testFailureEmbeddings.id, row.id));
      embedded++;
    } catch (error: any) {
      console.error(`Failed to embed test_failure_embeddings#${row.id}:`, error.message);
      failed++;
    }
  }

  return NextResponse.json({ success: true, embedded, failed, remaining: pending.length - embedded - failed, model: EMBEDDING_MODEL });
}
