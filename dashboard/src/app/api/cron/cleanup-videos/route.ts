import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { lt } from 'drizzle-orm';
import { db } from '../../../../../db';
import { automationLiveFrames } from '../../../../../db/schema';

cloudinary.config({ secure: true });

const RETENTION_DAYS = 30;
const MAX_PAGES = 20; // safety cap per run; remaining old videos get caught on the next day's run
const STALE_FRAME_MINUTES = 10; // safety net for orphaned rows left by a CI run that crashed before its DELETE

/** Best-effort: a crashed CI run can leave a live-frame row behind forever otherwise. */
async function cleanupStaleLiveFrames(): Promise<number> {
  const frameCutoff = new Date(Date.now() - STALE_FRAME_MINUTES * 60 * 1000);
  try {
    const result: any = await db.delete(automationLiveFrames).where(lt(automationLiveFrames.updatedAt, frameCutoff));
    return result?.rowsAffected ?? result?.[0]?.affectedRows ?? 0;
  } catch (error: any) {
    console.error('Live frame cleanup error:', error.message);
    return 0;
  }
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
  let deleted = 0;
  let nextCursor: string | undefined;

  const staleFramesDeleted = await cleanupStaleLiveFrames();

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await cloudinary.api.resources({
        type: 'authenticated',
        resource_type: 'video',
        prefix: 'qa-console/',
        max_results: 100,
        next_cursor: nextCursor,
      });

      const staleIds: string[] = result.resources
        .filter((r: any) => new Date(r.created_at) < cutoff)
        .map((r: any) => r.public_id);

      if (staleIds.length > 0) {
        await cloudinary.api.delete_resources(staleIds, { resource_type: 'video', type: 'authenticated' });
        deleted += staleIds.length;
      }

      nextCursor = result.next_cursor;
      if (!nextCursor) break;
    }

    return NextResponse.json({ success: true, deleted, staleFramesDeleted, cutoff: cutoff.toISOString() });
  } catch (error: any) {
    console.error('Video cleanup cron error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
