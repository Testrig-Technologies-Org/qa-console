// src/app/api/automation/build/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../../db';
import { automationBuilds } from '../../../../../../db/schema';
import { getProjectIfKeyValid } from '../../../../../lib/automation-auth';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_id, environment, type } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Missing project_id parameter' }, { status: 400 });
    }

    // Verify API key belongs to this project
    const apiKey = req.headers.get('x-api-key');
    const project = await getProjectIfKeyValid(Number(project_id), apiKey);

    if (!project) {
      return NextResponse.json({ error: 'Invalid API key for this project' }, { status: 401 });
    }

    // Create the build
    const result = await db.insert(automationBuilds).values({
      projectId: Number(project_id),
      organizationId: project.organizationId,
      environment: environment || 'dev',
      status: 'running',
      type: type || 'playwright',
    });

    const insertedId = (result as any).lastInsertId;
    return NextResponse.json({
      success: true,
      buildId: insertedId,
      projectId: project_id,
      organizationId: project.organizationId,
    });

  } catch (error: any) {
    console.error('CRITICAL_DB_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Pipeline Error', details: error.message },
      { status: 500 }
    );
  }
}