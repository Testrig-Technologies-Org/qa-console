// Only used when the build has no test currently marked RUNNING at all — either nothing has
// started yet (slow environment/webServer bootstrap) or everything finished but onEnd() never
// fired to mark the build complete. Not test-timeout-aware since there's no specific test to
// read a timeout from in this case, so kept generous to avoid false positives on a slow start.
const FALLBACK_BUILD_BOOTSTRAP_MS = 30 * 60 * 1000;
const FALLBACK_TEST_TIMEOUT_MS = 30 * 60 * 1000;
const STALE_GRACE_MS = 10 * 60 * 1000;

/**
 * A build stuck in `running` this long almost certainly isn't still going — its CI process
 * likely crashed or got killed before it could report a final status (network blip on the last
 * report, job timeout, OOM, etc.).
 *
 * Prefers the actual running test's own configured timeout (Playwright already resolves this
 * correctly per-test, accounting for testConfig.timeout, test.setTimeout, test.slow, etc.) over
 * a blanket threshold — a client whose tests have deliberately long flows shouldn't have those
 * misflagged as stalled just because they legitimately take longer than a generic guess.
 *
 * Pure and isomorphic (only uses Date.now()/JSON.parse) so the same source of truth backs the
 * UI's "stalled" badge (read-only) and the server-side auto-correction that actually persists
 * `failed` to the database (see getBuildDetails and the cleanup cron).
 */
export function isBuildStale(build: { status?: string | null; createdAt?: string | Date | null } | null | undefined, results: any[] = []): boolean {
  if (build?.status !== 'running') return false;

  const allTests = (results || []).flatMap((spec: any) => {
    const tests = typeof spec?.tests === 'string' ? JSON.parse(spec.tests) : spec?.tests;
    return Array.isArray(tests) ? tests : [];
  });
  const runningTest = allTests.find((t: any) => t?.status === 'RUNNING' && !t?.is_final);

  if (runningTest?.created_at) {
    const effectiveTimeout = typeof runningTest.timeout_ms === 'number' && runningTest.timeout_ms > 0
      ? runningTest.timeout_ms
      : FALLBACK_TEST_TIMEOUT_MS;
    return Date.now() - new Date(runningTest.created_at).getTime() > effectiveTimeout + STALE_GRACE_MS;
  }

  if (!build?.createdAt) return false;
  return Date.now() - new Date(build.createdAt).getTime() > FALLBACK_BUILD_BOOTSTRAP_MS;
}
