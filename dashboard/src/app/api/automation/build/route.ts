import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../../db';
import { automationBuilds } from '../../../../../db/schema';
import { getProjectIfKeyValid } from '../../../../lib/automation-auth';

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