// src/app/api/automation/live-frame/route.ts
import { NextResponse } from 'next/server';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../../../../db';
import { automationBuilds, automationLiveFrames } from '../../../../../db/schema';
import { getProjectIfKeyValid } from '../../../../lib/automation-auth';

/**
 * The CI watcher never learns the numeric buildId the reporter creates (it runs as a separate
 * globalSetup process) — so frames resolve to a build the same way the reporter groups sharded
 * runs: most-recent running build for the project, narrowed by session_id when the CI job sets
 * one. If a project runs two builds concurrently without distinct session_ids, frames can
 * briefly land on the wrong build — set QA_CONSOLE_SESSION_ID to avoid that, same as for build
 * grouping today.
 */
async function resolveRunningBuild(projectId: number, sessionId?: string | null) {
  const conditions = [eq(automationBuilds.projectId, projectId), eq(automationBuilds.status, 'running')];
  if (sessionId) conditions.push(eq(automationBuilds.sessionId, sessionId));

  return db.query.automationBuilds.findFirst({
    where: and(...conditions),
    orderBy: [desc(automationBuilds.createdAt)],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_id, session_id, worker_id, frame_base64 } = body;

    if (!project_id || !frame_base64) {
      return NextResponse.json({ error: 'Missing project_id or frame_base64' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    const project = await getProjectIfKeyValid(Number(project_id), apiKey);
    if (!project) {
      return NextResponse.json({ error: 'Invalid API key for this project' }, { status: 401 });
    }

    const build = await resolveRunningBuild(Number(project_id), session_id || null);
    if (!build) {
      // No active build to attach this frame to (run hasn't started reporting yet, or already
      // finished) — not an error, the frame is simply dropped.
      return NextResponse.json({ success: true, skipped: true });
    }

    // Plain upsert, no lock: unlike testResults writes, an overwritten mid-flight frame is the
    // desired behavior here, not a lost update. Keyed by (buildId, workerId): a build can have
    // several tests genuinely running at once, each needing its own frame slot — matches
    // worker_id already sent on every testResults entry (Playwright's parallelIndex), so the
    // dashboard can join a RUNNING test row to the right frame.
    await db
      .insert(automationLiveFrames)
      .values({ buildId: build.id, workerId: Number(worker_id) || 0, frameData: frame_base64 })
      .onDuplicateKeyUpdate({ set: { frameData: frame_base64 } });

    return NextResponse.json({ success: true, buildId: build.id });
  } catch (error: any) {
    console.error('LIVE_FRAME_WRITE_ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { project_id, session_id } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    const project = await getProjectIfKeyValid(Number(project_id), apiKey);
    if (!project) {
      return NextResponse.json({ error: 'Invalid API key for this project' }, { status: 401 });
    }

    const build = await resolveRunningBuild(Number(project_id), session_id || null);
    if (!build) {
      return NextResponse.json({ success: true, skipped: true });
    }

    // No workerId filter — the watcher's teardown fires once for the whole run, so this clears
    // every worker's frame for the build, not just one.
    await db.delete(automationLiveFrames).where(eq(automationLiveFrames.buildId, build.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('LIVE_FRAME_DELETE_ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
