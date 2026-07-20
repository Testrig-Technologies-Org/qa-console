import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../../db';
import { automationBuilds } from '../../../../../db/schema';
import { getBuildIfKeyValid, getProjectIfKeyValid } from '../../../../lib/automation-auth';

const VALID_BUILD_STATUSES = ['running', 'passed', 'failed'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_id, environment, type, session_id } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    const project = await getProjectIfKeyValid(Number(project_id), apiKey);

    if (!project) {
      return NextResponse.json({ error: 'Invalid API key for this project' }, { status: 401 });
    }
    if (session_id) {
      const existingBuild = await db.query.automationBuilds.findFirst({
        where: and(
          eq(automationBuilds.projectId, Number(project_id)),
          eq(automationBuilds.sessionId, session_id)
        ),
      });

      if (existingBuild) {
        return NextResponse.json({
          success: true,
          buildId: existingBuild.id,
          projectId: project_id,
          organizationId: project.organizationId,
        });
      }
    }
    const insertValues = {
      projectId: Number(project_id),
      organizationId: project.organizationId,
      sessionId: session_id || null,
      environment: environment || 'dev',
      status: 'running',
      type: type || 'playwright',
    };

    const result = await db.insert(automationBuilds)
      .values(insertValues)
      .onDuplicateKeyUpdate({
        set: { status: 'running' }
      });
    let finalBuildId = (result as any).lastInsertId;

    if (!finalBuildId && session_id) {
      const fallback = await db.query.automationBuilds.findFirst({
        where: and(
          eq(automationBuilds.projectId, Number(project_id)),
          eq(automationBuilds.sessionId, session_id)
        ),
      });
      finalBuildId = fallback?.id;
    }
    return NextResponse.json({
      success: true,
      buildId: finalBuildId,
      projectId: project_id,
      organizationId: project.organizationId,
    });

  } catch (error: any) {
    console.error('CRITICAL_PIPELINE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/** Marks a build's final status once the run has finished (e.g. called from a reporter's onEnd hook). */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { build_id, status } = body;

    if (!build_id || !status) {
      return NextResponse.json({ error: 'Missing build_id or status' }, { status: 400 });
    }
    if (!VALID_BUILD_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_BUILD_STATUSES.join(', ')}` }, { status: 400 });
    }

    const apiKey = req.headers.get('x-api-key');
    const authResult = await getBuildIfKeyValid(Number(build_id), apiKey);

    if (!authResult) {
      return NextResponse.json({ error: 'Invalid API key or build not found' }, { status: 401 });
    }

    await db.update(automationBuilds).set({ status }).where(eq(automationBuilds.id, Number(build_id)));

    return NextResponse.json({ success: true, buildId: Number(build_id), status });
  } catch (error: any) {
    console.error('BUILD_STATUS_UPDATE_ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}