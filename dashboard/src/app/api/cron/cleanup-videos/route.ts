import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { eq, lt } from 'drizzle-orm';
import { db } from '../../../../../db';
import { automationBuilds, automationLiveFrames, testResults } from '../../../../../db/schema';
import { isBuildStale } from '../../../../lib/build-staleness';

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

/**
 * Backstop for builds nobody is actively viewing — getBuildDetails already self-heals a stale
 * build the moment someone opens it, but a build no one looks at would otherwise stay stuck at
 * `running` forever (skewing pass-rate stats/trends) until this once-daily sweep catches it.
 */
async function markStaleBuildsFailed(): Promise<number> {
  try {
    const runningBuilds = await db.query.automationBuilds.findMany({
      where: eq(automationBuilds.status, 'running'),
    });

    let marked = 0;
    for (const build of runningBuilds) {
      const results = await db.query.testResults.findMany({ where: eq(testResults.buildId, build.id) });
      if (isBuildStale(build, results)) {
        await db.update(automationBuilds).set({ status: 'failed' }).where(eq(automationBuilds.id, build.id));
        marked++;
      }
    }
    return marked;
  } catch (error: any) {
    console.error('Stale build cleanup error:', error.message);
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
  const staleBuildsMarkedFailed = await markStaleBuildsFailed();

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

    return NextResponse.json({ success: true, deleted, staleFramesDeleted, staleBuildsMarkedFailed, cutoff: cutoff.toISOString() });
  } catch (error: any) {
    console.error('Video cleanup cron error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
