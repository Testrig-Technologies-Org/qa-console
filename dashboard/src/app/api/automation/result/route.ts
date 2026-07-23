// src/app/api/automation/result/route.ts
import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../../../../db';
import { testFailureEmbeddings, testResults } from '../../../../../db/schema';
import { getBuildIfKeyValid, getProjectIfKeyValid } from '../../../../lib/automation-auth';
import { withDuplicateKeyRetry } from '../../../../lib/automation-concurrency';


const DEBUG_MODE = true;

/* -------------------- HELPER FUNCTIONS -------------------- */

const debugLog = (section: string, data: any) => {
  if (!DEBUG_MODE) return;
};

const cleanText = (text: any): string => {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);
  return text.replace(/[\u001b\x1b]\[[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim();
};

const normalizeStatus = (status: string): string => {
  if (!status) return 'UNKNOWN';
  const upper = status.toUpperCase();
  return ['PASSED', 'FAILED', 'SKIPPED', 'RUNNING'].includes(upper) ? upper : upper;
};

const validatePayload = (body: any): { valid: boolean; error?: string } => {
  if (!body.build_id) return { valid: false, error: 'Missing build_id' };
  if (!body.spec_file) return { valid: false, error: 'Missing spec_file' };
  if (!body.test_entry && !body.type) return { valid: false, error: 'Missing test_entry or type' };
  return { valid: true };
};

const getUniqueTestKey = (test_entry: any): string => {
  return `${test_entry?.project || 'default'}::${test_entry?.title || 'unknown'}`;
};

/* -------------------- MUTEX LOCK -------------------- */
// Only serializes requests within a single warm instance — on serverless platforms,
// concurrent requests can land on separate instances with their own empty lock map,
// so this alone cannot prevent the race below. Kept as a cheap fast-path.

const locks = new Map<string, Promise<void>>();

async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  while (locks.has(key)) {
    await locks.get(key);
  }

  let resolve: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  locks.set(key, promise);

  try {
    return await fn();
  } finally {
    locks.delete(key);
    resolve!();
  }
}


/* -------------------- POST HANDLER -------------------- */

export async function POST(req: Request) {
  const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  try {
    const body = await req.json();

    const validation = validatePayload(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const build_id = typeof body.build_id === 'string' ? parseInt(body.build_id, 10) : body.build_id;
    const { spec_file, test_entry, unique_test_key } = body;
    const testUniqueKey = unique_test_key || getUniqueTestKey(test_entry);
    const isFinal = test_entry?.is_final === true;

    // Verify API key belongs to this build's project, and get build to find organizationId/projectId
    const apiKey = req.headers.get('x-api-key');
    const authResult = await getBuildIfKeyValid(build_id, apiKey);

    if (!authResult) {
      console.error(`❌ [${requestId}] Invalid API key or build not found`);
      return NextResponse.json({ error: 'Invalid API key or build not found' }, { status: 401 });
    }

    const { build } = authResult;

    const lockKey = `${build_id}:${spec_file}`;

    debugLog(`INCOMING [${requestId}]`, {
      build_id,
      spec_file,
      testUniqueKey,
      isFinal,
      status: test_entry?.status,
      organizationId: build.organizationId,
    });

    return await withLock(lockKey, () => withDuplicateKeyRetry(() => db.transaction(async (tx) => {
        // SELECT ... FOR UPDATE holds a row lock for the rest of this transaction, so a
        // second concurrent write (even from a different serverless instance) blocks here
        // until this one commits, instead of reading a stale snapshot and clobbering it.
        // withLock above is just a same-instance fast-path to skip the extra round trip.
        const existingRows = await tx
          .select()
          .from(testResults)
          .where(and(eq(testResults.buildId, build_id), eq(testResults.specFile, spec_file)))
          .for('update')
          .limit(1);
        const existing = existingRows[0];

        let tests: any[] = existing ? [...(existing.tests as any[])] : [];

        debugLog(`EXISTING TESTS [${requestId}]`, {
          count: tests.length,
          keys: tests.map((t) => `${t.project}::${t.title}`),
        });

        // Find test by unique key
        let testIdx = tests.findIndex((t: any) => {
          const key = `${t.project || 'default'}::${t.title || 'unknown'}`;
          return key === testUniqueKey;
        });

        const existingTest = testIdx !== -1 ? tests[testIdx] : null;
        const existingIsFinal = existingTest?.is_final === true;

        // Skip if existing is final and incoming is not
        if (existingIsFinal && !isFinal) {
          debugLog(`SKIPPED [${requestId}]`, { reason: 'Final exists', testUniqueKey });
          return NextResponse.json({
            success: true,
            skipped: true,
            reason: 'Final result already exists',
            data: { build_id: String(build_id), spec_file, test_key: testUniqueKey },
          });
        }

        // Create or update test
        if (testIdx === -1 && test_entry) {
          tests.push({
            title: test_entry.title,
            project: test_entry.project,
            unique_key: testUniqueKey,
            status: 'RUNNING',
            is_final: false,
            logs: [],
            steps: [],
            // Forwarded from the RUNNING report so it survives even if this test never reaches
            // the update branch below (e.g. its worker crashes) — that's exactly the case the
            // dashboard needs this for, to tell a genuinely long-running test apart from a
            // stuck one using its own configured timeout instead of a guessed threshold.
            timeout_ms: test_entry.timeout_ms,
            created_at: new Date().toISOString(),
          });
          testIdx = tests.length - 1;
          debugLog(`CREATED [${requestId}]`, { testUniqueKey, index: testIdx });
        }

        if (testIdx !== -1 && test_entry) {
          const normalizedStatus = normalizeStatus(test_entry.status);

          tests[testIdx] = {
            ...tests[testIdx],
            ...test_entry,
            unique_key: testUniqueKey,
            status: normalizedStatus,
            is_final: isFinal,
            duration_ms: test_entry.duration_ms || 0,
            duration_seconds: test_entry.duration_seconds || '0',
            steps: test_entry.steps || tests[testIdx].steps || [],
            attachments: test_entry.attachments || tests[testIdx].attachments,
            error: test_entry.error
              ? {
                  message: cleanText(test_entry.error.message),
                  stack: cleanText(test_entry.error.stack),
                  location: test_entry.error.location,
                }
              : tests[testIdx].error,
            case_codes: test_entry.case_codes || ['N/A'],
            run_number: test_entry.run_number || 1,
            retry_count: test_entry.retry_count || 0,
            is_flaky: test_entry.is_flaky || false,
            step_summary: test_entry.step_summary,
            metadata: test_entry.metadata,
            updated_at: new Date().toISOString(),
          };

          debugLog(`UPDATED [${requestId}]`, {
            testUniqueKey,
            status: normalizedStatus,
            is_final: isFinal,
          });
        }

        debugLog(`SAVING [${requestId}]`, {
          totalTests: tests.length,
          tests: tests.map((t) => ({
            key: t.unique_key || `${t.project}::${t.title}`,
            status: t.status,
            is_final: t.is_final,
          })),
        });

        // Save to database
        let testResultId: number;
        if (existing) {
          await tx
            .update(testResults)
            .set({ tests: tests as any })
            .where(and(eq(testResults.buildId, build_id), eq(testResults.specFile, spec_file)));
          testResultId = existing.id;
        } else {
          const insertRes = await tx.insert(testResults).values({
            buildId: build_id as any,
            projectId: build.projectId,
            organizationId: build.organizationId,
            specFile: spec_file,
            tests: tests as any,
          });
          testResultId = (insertRes as any).lastInsertId ?? (insertRes as any)[0]?.insertId;
        }

        // Run Intelligence — queue this failure for embedding. Written with embedding=NULL here
        // (cheap, synchronous) and filled in later by the embed-failures cron, so CI reporting
        // never blocks on an embedding API call.
        if (isFinal && testIdx !== -1 && tests[testIdx].status === 'FAILED') {
          const finalEntry = tests[testIdx];
          const signature = [
            finalEntry.title,
            finalEntry.error?.message,
            finalEntry.error?.location ? `${finalEntry.error.location.file}:${finalEntry.error.location.line}` : undefined,
          ].filter(Boolean).join('\n');

          await tx.insert(testFailureEmbeddings).values({
            buildId: build_id,
            testResultId,
            projectId: build.projectId,
            organizationId: build.organizationId,
            uniqueKey: testUniqueKey,
            caseCode: finalEntry.case_codes?.[0] !== 'N/A' ? finalEntry.case_codes?.[0] : undefined,
            specFile: spec_file,
            title: finalEntry.title ?? 'Untitled test',
            signature,
          });
        }

        // Calculate stats
        const finalTests = tests.filter((t: any) => t.is_final === true);
        const stats = {
          total_tests: tests.length,
          final_tests: finalTests.length,
          passed: finalTests.filter((t: any) => t.status === 'PASSED').length,
          failed: finalTests.filter((t: any) => t.status === 'FAILED').length,
          running: tests.filter((t: any) => !t.is_final).length,
        };

        debugLog(`STATS [${requestId}]`, stats);

        return NextResponse.json({
          success: true,
          requestId,
          data: {
            build_id: String(build_id),
            spec_file,
            test_key: testUniqueKey,
            is_final: isFinal,
            test_count: tests.length,
            final_count: finalTests.length,
            passed: stats.passed,
            failed: stats.failed,
          },
        });
      })));
  } catch (error: any) {
    console.error(`❌ [${requestId}] Error:`, error);
    return NextResponse.json({ error: error.message || 'Internal server error', requestId }, { status: 500 });
  }
}

/* -------------------- GET HANDLER -------------------- */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const build_id_param = searchParams.get('build_id');
    const project_id_param = searchParams.get('project_id');
    const only_final = searchParams.get('only_final') === 'true';
    const debug = searchParams.get('debug') === 'true';

    if (!build_id_param && !project_id_param) {
      return NextResponse.json({ error: 'Missing build_id or project_id' }, { status: 400 });
    }

    // Verify API key belongs to the referenced project (resolved via build_id if project_id isn't given)
    const apiKey = req.headers.get('x-api-key');
    const authedProject = project_id_param
      ? await getProjectIfKeyValid(Number(project_id_param), apiKey)
      : (await getBuildIfKeyValid(parseInt(build_id_param!, 10), apiKey))?.project;

    if (!authedProject) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    // Build query conditions
    const conditions = [];

    if (build_id_param) {
      const build_id = parseInt(build_id_param, 10);
      if (isNaN(build_id)) {
        return NextResponse.json({ error: 'Invalid build_id' }, { status: 400 });
      }
      conditions.push(eq(testResults.buildId, build_id));
    }

    if (project_id_param) {
      const project_id = parseInt(project_id_param, 10);
      if (isNaN(project_id)) {
        return NextResponse.json({ error: 'Invalid project_id' }, { status: 400 });
      }
      conditions.push(eq(testResults.projectId, project_id));
    }

    const results = await db.query.testResults.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (results, { desc }) => [desc(results.executedAt)],
    });

    // Flatten and deduplicate
    const allTestsMap = new Map<string, any>();

    results.forEach((r: any) => {
      (r.tests as any[])?.forEach((t: any) => {
        const key = t.unique_key || `${t.project}::${t.title}`;
        const existing = allTestsMap.get(key);

        if (!existing || (t.is_final && !existing.is_final)) {
          allTestsMap.set(key, { ...t, unique_key: key });
        }
      });
    });

    let allTests = Array.from(allTestsMap.values());

    if (only_final) {
      allTests = allTests.filter((t) => t.is_final === true);
    }

    const summary = {
      total: allTests.length,
      final: allTests.filter((t) => t.is_final).length,
      passed: allTests.filter((t) => t.is_final && t.status === 'PASSED').length,
      failed: allTests.filter((t) => t.is_final && t.status === 'FAILED').length,
      running: allTests.filter((t) => !t.is_final).length,
    };

    return NextResponse.json({
      success: true,
      data: results,
      tests: allTests,
      count: allTests.length,
      summary,
      ...(debug && {
        debug: {
          raw: allTests.map((t) => ({
            key: t.unique_key,
            status: t.status,
            is_final: t.is_final,
          })),
        },
      }),
    });
  } catch (error: any) {
    console.error('❌ GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}