// Safe, pre-scoped query functions for the Run Intelligence chat feature. The LLM never writes
// or executes SQL itself — it can only call these functions, each of which takes an
// organizationId supplied by the server (never by the model) and does its own parameterized
// query. This sidesteps SQL-injection and cross-tenant-leak risk entirely, at the cost of only
// being able to answer questions these functions actually cover.

import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { db } from '../../db';
import { automationBuilds, projects, testResults } from '../../db/schema';

const DEFAULT_STATS_DAYS = 30;
const DEFAULT_FAILURES_DAYS = 7;
const MAX_LIMIT = 20;
// Tools that list individual named tests (as opposed to builds or flaky-test summaries) can
// legitimately have far more than 20 real matches — a 35-failure org asking for "all failed
// tests" should get 35 back, not be silently truncated to 20.
const MAX_TEST_LIST_LIMIT = 100;

async function resolveProject(organizationId: string, projectName?: string) {
  if (!projectName) return null;
  const match = await db.query.projects.findFirst({
    where: and(eq(projects.organizationId, organizationId), sql`LOWER(${projects.name}) LIKE ${'%' + projectName.toLowerCase() + '%'}`),
  });
  return match ?? undefined; // undefined (not null) signals "name given but no match" vs "no name given"
}

function cutoffDate(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/* -------------------- TOOL IMPLEMENTATIONS -------------------- */

async function listProjects({ organizationId }: { organizationId: string }) {
  const rows = await db.query.projects.findMany({
    where: eq(projects.organizationId, organizationId),
    columns: { id: true, name: true, type: true },
  });
  return { projects: rows };
}

async function getPassRateStats({ organizationId, project_name, days }: { organizationId: string; project_name?: string; days?: number }) {
  const project = await resolveProject(organizationId, project_name);
  if (project === undefined) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

  const cutoff = cutoffDate(days || DEFAULT_STATS_DAYS);
  const rows = await db.query.testResults.findMany({
    where: and(
      eq(testResults.organizationId, organizationId),
      ...(project ? [eq(testResults.projectId, project.id)] : []),
      gte(testResults.executedAt, cutoff),
    ),
    columns: { tests: true, projectId: true },
    limit: 1000,
  });

  const stats = { total: 0, passed: 0, failed: 0, skipped: 0 };
  const byProject = new Map<number, { total: number; passed: number }>();

  for (const row of rows) {
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final) continue;
      stats.total++;
      const p = byProject.get(row.projectId) ?? { total: 0, passed: 0 };
      p.total++;
      if (t.status === 'PASSED') { stats.passed++; p.passed++; }
      else if (t.status === 'FAILED') stats.failed++;
      else if (t.status === 'SKIPPED') stats.skipped++;
      byProject.set(row.projectId, p);
    }
  }

  return {
    scope: project ? project.name : 'all projects in organization',
    windowDays: days || DEFAULT_STATS_DAYS,
    ...stats,
    passRate: stats.total > 0 ? Math.round((stats.passed / stats.total) * 1000) / 10 : null,
  };
}

async function getRecentBuilds({ organizationId, project_name, limit }: { organizationId: string; project_name?: string; limit?: number }) {
  const project = await resolveProject(organizationId, project_name);
  if (project === undefined) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

  const rows = await db.query.automationBuilds.findMany({
    where: and(eq(automationBuilds.organizationId, organizationId), ...(project ? [eq(automationBuilds.projectId, project.id)] : [])),
    orderBy: (b, { desc }) => [desc(b.createdAt)],
    limit: Math.min(limit || 10, MAX_LIMIT),
    columns: { id: true, status: true, environment: true, type: true, createdAt: true, projectId: true },
  });

  return { builds: rows };
}

async function getBuildSummary({ organizationId, build_id }: { organizationId: string; build_id: number }) {
  const build = await db.query.automationBuilds.findFirst({
    where: and(eq(automationBuilds.id, build_id), eq(automationBuilds.organizationId, organizationId)),
  });
  if (!build) return { error: `No build #${build_id} found in this organization.` };

  const results = await db.query.testResults.findMany({ where: eq(testResults.buildId, build_id) });
  const stats = { total: 0, passed: 0, failed: 0, skipped: 0, orphaned: 0, durationMs: 0 };
  // The build itself already resolved (isn't 'running' anymore) — any test entry still stuck at
  // is_final=false is therefore unambiguously orphaned (its worker crashed before reporting a
  // final result), not "still in progress". No staleness/timeout heuristic needed, the build's
  // own terminal status already proves it. Counted as failed since the run concluded without it.
  const buildConcluded = build.status !== 'running';
  for (const row of results) {
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final) {
        if (!buildConcluded) continue; // genuinely still running
        stats.total++;
        stats.orphaned++;
        stats.failed++;
        continue;
      }
      stats.total++;
      stats.durationMs += Number(t.duration_ms) || 0;
      if (t.status === 'PASSED') stats.passed++;
      else if (t.status === 'FAILED') stats.failed++;
      else if (t.status === 'SKIPPED') stats.skipped++;
    }
  }

  return { buildId: build.id, status: build.status, environment: build.environment, createdAt: build.createdAt, ...stats };
}

async function getFailingTests({ organizationId, project_name, days, limit }: { organizationId: string; project_name?: string; days?: number; limit?: number }) {
  const project = await resolveProject(organizationId, project_name);
  if (project === undefined) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

  const cutoff = cutoffDate(days || DEFAULT_FAILURES_DAYS);
  const rows = await db.query.testResults.findMany({
    where: and(
      eq(testResults.organizationId, organizationId),
      ...(project ? [eq(testResults.projectId, project.id)] : []),
      gte(testResults.executedAt, cutoff),
    ),
    orderBy: (t, { desc }) => [desc(t.executedAt)],
    limit: 500,
  });

  const byKey = new Map<string, { title: string; specFile: string; buildId: number; lastFailedAt: Date }>();
  for (const row of rows) {
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final || t.status !== 'FAILED') continue;
      const key = t.unique_key || `${t.project}::${t.title}`;
      if (byKey.has(key)) continue; // rows are already newest-first, so first occurrence is most recent
      byKey.set(key, { title: t.title, specFile: row.specFile, buildId: row.buildId, lastFailedAt: row.executedAt as Date });
    }
  }

  const allFailing = Array.from(byKey.values());
  return { count: allFailing.length, failingTests: allFailing.slice(0, Math.min(limit || 10, MAX_TEST_LIST_LIMIT)) };
}

async function getFlakyTestsSummary({ organizationId, project_name, limit }: { organizationId: string; project_name: string; limit?: number }) {
  const project = await resolveProject(organizationId, project_name);
  if (!project) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

  const cutoff = cutoffDate(60);
  const rows = await db.query.testResults.findMany({
    where: and(eq(testResults.projectId, project.id), eq(testResults.organizationId, organizationId), gte(testResults.executedAt, cutoff)),
    limit: 500,
  });

  const byKey = new Map<string, { title: string; specFile: string; totalRuns: number; flakyRuns: number }>();
  for (const row of rows) {
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final) continue;
      const key = t.unique_key || `${t.project}::${t.title}`;
      const entry = byKey.get(key) ?? { title: t.title, specFile: row.specFile, totalRuns: 0, flakyRuns: 0 };
      entry.totalRuns++;
      if (t.is_flaky) entry.flakyRuns++;
      byKey.set(key, entry);
    }
  }

  const flaky = Array.from(byKey.values())
    .filter((t) => t.flakyRuns > 0)
    .sort((a, b) => b.flakyRuns / b.totalRuns - a.flakyRuns / a.totalRuns)
    .slice(0, Math.min(limit || 10, MAX_LIMIT))
    .map((t) => ({ ...t, flakeRate: Math.round((t.flakyRuns / t.totalRuns) * 100) }));

  return { project: project.name, flakyTests: flaky };
}

const DEFAULT_SEARCH_LIMIT = 15;
const SEARCH_ROW_SCAN_CAP = 1000; // no date window here — the point is "current status of test X", so scan recent rows regardless of age until enough matches are found

/**
 * General test lookup — by name (partial, case-insensitive), status, or both. Distinct from
 * get_failing_tests (failures only) and get_chart_data (aggregates only): this returns each
 * matching test's actual current status, not just a count or a failure list.
 */
async function searchTests({ organizationId, project_name, build_id, spec_file, query, status_filter, limit }: {
  organizationId: string; project_name?: string; build_id?: number; spec_file?: string; query?: string; status_filter?: StatusFilter; limit?: number;
}) {
  const statusWanted = status_filter && status_filter !== 'all' ? status_filter.toUpperCase() : null;
  const needle = query?.toLowerCase().trim();
  const specNeedle = spec_file?.toLowerCase().trim();

  let scopeLabel: string;
  let rows: { tests: any; executedAt: Date | null; specFile: string; buildId: number }[];
  // Only meaningful for the single-build path: a concluded build (status != 'running') proves any
  // is_final=false test in it is orphaned (worker crashed before reporting), not still in progress.
  let treatOrphanedAsFailed = false;

  if (build_id) {
    const build = await db.query.automationBuilds.findFirst({
      where: and(eq(automationBuilds.id, build_id), eq(automationBuilds.organizationId, organizationId)),
    });
    if (!build) return { error: `No build #${build_id} found in this organization.` };

    rows = await db.query.testResults.findMany({ where: eq(testResults.buildId, build_id) });
    scopeLabel = `Build #${build_id}`;
    treatOrphanedAsFailed = build.status !== 'running';
  } else {
    const project = await resolveProject(organizationId, project_name);
    if (project === undefined) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

    rows = await db.query.testResults.findMany({
      where: and(
        eq(testResults.organizationId, organizationId),
        ...(project ? [eq(testResults.projectId, project.id)] : []),
      ),
      orderBy: (t, { desc }) => [desc(t.executedAt)],
      limit: SEARCH_ROW_SCAN_CAP,
    });
    scopeLabel = project ? project.name : 'all projects in organization';
  }
  if (specNeedle) scopeLabel += ` · spec matching "${spec_file}"`;

  const byKey = new Map<string, { title: string; status: string; specFile: string; buildId: number; durationMs: number; lastRunAt: Date | null; errorMessage?: string; orphaned?: boolean }>();
  for (const row of rows) {
    if (specNeedle && !row.specFile?.toLowerCase().includes(specNeedle)) continue;

    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      let status = t.status || 'UNKNOWN';
      let orphaned = false;
      if (!t.is_final) {
        if (!treatOrphanedAsFailed) continue; // genuinely still running, not stale
        status = 'FAILED';
        orphaned = true;
      }
      if (statusWanted && status !== statusWanted) continue;
      if (needle && !t.title?.toLowerCase().includes(needle)) continue;

      const key = t.unique_key || `${t.project}::${t.title}`;
      if (byKey.has(key)) continue; // rows are newest-first, so the first match per key is its current status

      byKey.set(key, {
        title: t.title || 'Untitled test',
        status,
        specFile: row.specFile,
        buildId: row.buildId,
        durationMs: Number(t.duration_ms) || 0,
        lastRunAt: row.executedAt,
        errorMessage: orphaned
          ? 'Never reported a final result — its worker likely crashed or was killed before finishing.'
          : t.status === 'FAILED' ? (t.error?.message || '').slice(0, 300) : undefined,
        orphaned: orphaned || undefined,
      });
    }
  }

  const allMatches = Array.from(byKey.values());
  return {
    scope: scopeLabel,
    count: allMatches.length,
    tests: allMatches.slice(0, Math.min(limit || DEFAULT_SEARCH_LIMIT, MAX_TEST_LIST_LIMIT)),
  };
}

type ChartMetric = 'pass_rate' | 'failure_count' | 'avg_duration' | 'test_count';
type ChartGroupBy = 'date' | 'spec_file' | 'browser' | 'project' | 'test' | 'status';
type StatusFilter = 'all' | 'passed' | 'failed' | 'skipped';

/**
 * General-purpose chart data tool — one tool covering (metric × group-by) combinations instead of
 * a hardcoded function per chart. Still fully code-driven: metric, group_by, and status_filter are
 * constrained to fixed enums in the tool declaration (Gemini can't send arbitrary strings), the
 * bucketing/aggregation logic lives here, and the chart *shape* (line/bar/pie) is picked by
 * chatChartKind() in chat-chart-types.ts from (metric, group_by) — never chosen by the model, and
 * never rendered from LLM-generated plotting code.
 */
async function getChartData({ organizationId, project_name, build_id, spec_file, metric, group_by, status_filter, days, limit }: {
  organizationId: string; project_name?: string; build_id?: number; spec_file?: string; metric: ChartMetric; group_by: ChartGroupBy; status_filter?: StatusFilter; days?: number; limit?: number;
}) {
  const statusWanted = status_filter && status_filter !== 'all' ? status_filter.toUpperCase() : null;
  const specNeedle = spec_file?.toLowerCase().trim() || null;

  // build_id pins to one specific build instead of a date window across builds — mutually
  // exclusive with project_name/days, and still org-scoped (a build_id from another org 404s
  // here rather than silently falling through to the all-builds path).
  let windowDays = 0;
  let scopeLabel: string;
  let rows: { tests: any; executedAt: Date | null; specFile: string; projectId: number }[];
  // Only meaningful for the single-build path: a concluded build (status != 'running') proves any
  // is_final=false test in it is orphaned (worker crashed before reporting), not still running.
  let treatOrphanedAsFailed = false;

  if (build_id) {
    const build = await db.query.automationBuilds.findFirst({
      where: and(eq(automationBuilds.id, build_id), eq(automationBuilds.organizationId, organizationId)),
    });
    if (!build) return { error: `No build #${build_id} found in this organization.` };

    rows = await db.query.testResults.findMany({
      where: eq(testResults.buildId, build_id),
      columns: { tests: true, executedAt: true, specFile: true, projectId: true },
    });
    scopeLabel = `Build #${build_id}`;
    treatOrphanedAsFailed = build.status !== 'running';
  } else {
    const project = await resolveProject(organizationId, project_name);
    if (project === undefined) return { error: `No project found matching "${project_name}". Call list_projects to see available projects.` };

    windowDays = Math.min(days || DEFAULT_STATS_DAYS, 90);
    const cutoff = cutoffDate(windowDays);
    rows = await db.query.testResults.findMany({
      where: and(
        eq(testResults.organizationId, organizationId),
        ...(project ? [eq(testResults.projectId, project.id)] : []),
        gte(testResults.executedAt, cutoff),
      ),
      columns: { tests: true, executedAt: true, specFile: true, projectId: true },
      limit: 2000,
    });
    scopeLabel = project ? project.name : 'all projects in organization';
  }
  if (specNeedle) scopeLabel += ` · spec matching "${spec_file}"`;

  let projectNames: Record<number, string> = {};
  if (group_by === 'project') {
    const allProjects = await db.query.projects.findMany({
      where: eq(projects.organizationId, organizationId),
      columns: { id: true, name: true },
    });
    projectNames = Object.fromEntries(allProjects.map((p) => [p.id, p.name]));
  }

  const buckets = new Map<string, { total: number; passed: number; failed: number; durationSum: number }>();

  for (const row of rows) {
    if (specNeedle && !row.specFile?.toLowerCase().includes(specNeedle)) continue;

    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      let status = t.status;
      if (!t.is_final) {
        if (!treatOrphanedAsFailed) continue; // genuinely still running, not stale
        status = 'FAILED'; // its worker crashed before reporting — the build concluded without it
      }
      if (statusWanted && status !== statusWanted) continue;

      let key: string;
      if (group_by === 'date') key = new Date(row.executedAt as Date).toISOString().slice(0, 10);
      else if (group_by === 'spec_file') key = row.specFile;
      else if (group_by === 'browser') key = t.project || 'unknown';
      else if (group_by === 'test') key = t.title || 'Untitled test';
      else if (group_by === 'status') key = status || 'UNKNOWN';
      else key = projectNames[row.projectId] || `Project ${row.projectId}`;

      const bucket = buckets.get(key) ?? { total: 0, passed: 0, failed: 0, durationSum: 0 };
      bucket.total++;
      if (status === 'PASSED') bucket.passed++;
      else if (status === 'FAILED') bucket.failed++;
      bucket.durationSum += Number(t.duration_ms) || 0;
      buckets.set(key, bucket);
    }
  }

  let series = Array.from(buckets.entries()).map(([label, b]) => {
    const value =
      metric === 'pass_rate' ? (b.total > 0 ? Math.round((b.passed / b.total) * 1000) / 10 : 0) :
      metric === 'failure_count' ? b.failed :
      metric === 'avg_duration' ? (b.total > 0 ? Math.round(b.durationSum / b.total) : 0) :
      b.total; // test_count
    return { label, value };
  });

  // A "top failures by X" chart shouldn't be padded with zero-failure buckets — but a date trend
  // or a pass-rate/duration breakdown legitimately wants every bucket shown, zero included.
  if (metric === 'failure_count' && group_by !== 'date') {
    series = series.filter((s) => s.value > 0);
  }

  // group_by=test charts a set of individually-named tests, not a handful of natural categories
  // like browser/project — capping it at 15 silently dropped real tests from "all failed tests"
  // style requests, so it defaults much higher. An explicit limit (e.g. "top 5 tests") always wins
  // over the default for whichever group_by is in play.
  const defaultCap = group_by === 'test' ? 100 : 15;
  const cap = Math.min(Math.max(limit || defaultCap, 1), group_by === 'test' ? 100 : 50);
  series = group_by === 'date'
    ? series.sort((a, b) => a.label.localeCompare(b.label))
    : series.sort((a, b) => b.value - a.value).slice(0, cap);

  return { scope: scopeLabel, metric, group_by, status_filter: status_filter || 'all', windowDays: build_id ? undefined : windowDays, series };
}

/* -------------------- DISPATCH + DECLARATIONS -------------------- */

type ToolFn = (args: any) => Promise<any>;

const TOOL_IMPLS: Record<string, ToolFn> = {
  list_projects: listProjects,
  get_pass_rate_stats: getPassRateStats,
  get_recent_builds: getRecentBuilds,
  get_build_summary: getBuildSummary,
  get_failing_tests: getFailingTests,
  get_flaky_tests_summary: getFlakyTestsSummary,
  search_tests: searchTests,
  get_chart_data: getChartData,
};

/** Executes a tool by name, always injecting the caller's real organizationId — args from the model can never override it. */
export async function executeTool(name: string, args: Record<string, any>, organizationId: string): Promise<any> {
  const impl = TOOL_IMPLS[name];
  if (!impl) return { error: `Unknown tool "${name}"` };
  try {
    return await impl({ ...args, organizationId });
  } catch (e: any) {
    console.error(`chat-tools: ${name} failed:`, e.message);
    return { error: 'Internal error running this query' };
  }
}

export const TOOL_DECLARATIONS = [
  {
    name: 'list_projects',
    description: 'List all projects in the organization, with their IDs and test framework type.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'get_pass_rate_stats',
    description: 'Get pass/fail/skip counts and pass rate over a recent time window, for one project or the whole organization.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects combined)' },
        days: { type: 'NUMBER', description: 'Lookback window in days, default 30' },
      },
    },
  },
  {
    name: 'get_recent_builds',
    description: 'List the most recent CI builds, with status/environment/date, for one project or the whole organization.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects)' },
        limit: { type: 'NUMBER', description: 'Max builds to return, default 10, max 20' },
      },
    },
  },
  {
    name: 'get_build_summary',
    description: 'Get status and pass/fail stats for one specific build by its numeric ID. If the build has ' +
      'concluded, any test still stuck without a final result is counted as both "orphaned" and folded into ' +
      '"failed" — its worker crashed before reporting, not a false "still running".',
    parameters: {
      type: 'OBJECT',
      properties: { build_id: { type: 'NUMBER', description: 'The numeric build ID' } },
      required: ['build_id'],
    },
  },
  {
    name: 'get_failing_tests',
    description: 'List currently/recently failing tests, with the build and spec file they failed in. The ' +
      'response\'s count field is the true total number of currently-failing tests — use that for "how many ' +
      'tests are failing" (not the length of failingTests, which is capped by limit). If the user asks for a ' +
      'specific number (e.g. "top 5 failing tests", "give me 20"), pass that number as limit so the list ' +
      'matches exactly what they asked for; otherwise leave limit unset and just report count plus the ' +
      'default-sized list.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects)' },
        days: { type: 'NUMBER', description: 'Lookback window in days, default 7' },
        limit: { type: 'NUMBER', description: 'Max tests to return in failingTests, default 10, max 100. Set this when the user asks for a specific count like "top 5" or "20 failing tests", or a broad "all failed tests" (pass a high number like 100) — does not affect count, which is always the true total.' },
      },
    },
  },
  {
    name: 'get_flaky_tests_summary',
    description: 'List tests that needed a retry to eventually pass, ranked by flake rate, for a specific project over the last 60 days.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name (required)' },
        limit: { type: 'NUMBER', description: 'Max tests to return, default 10, max 20' },
      },
      required: ['project_name'],
    },
  },
  {
    name: 'search_tests',
    description: 'Look up tests by name, spec file, and/or status, returning each match\'s actual current ' +
      'status, spec file, build, duration, and (if failed) error message — not just a count, not an ' +
      'aggregate. Use this for "what\'s the status of test X", "find tests with Y in the name", "is test Z ' +
      'passing", "how many tests are in the hotfixes spec/file", "list the tests in build 240003", or any ' +
      'test-level lookup. The response\'s "count" field is the TRUE total match count — use that for "how ' +
      'many" questions, not the length of the (possibly truncated) "tests" list. When scoped to build_id, a ' +
      'test that never got a final result in a concluded build is reported as status FAILED with ' +
      'orphaned:true, not RUNNING — its worker crashed before finishing, the build isn\'t actually still going.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects). Ignored if build_id is set.' },
        build_id: { type: 'NUMBER', description: 'Scope to exactly one build by its numeric ID, instead of a project-wide search.' },
        spec_file: { type: 'STRING', description: 'Restrict to spec files whose path contains this text (case-insensitive partial match), e.g. "hotfixes".' },
        query: { type: 'STRING', description: 'Text to search for in test titles, case-insensitive partial match (omit to list by spec_file/status only)' },
        status_filter: { type: 'STRING', enum: ['all', 'passed', 'failed', 'skipped'], description: 'Restrict to tests with this current status, default all' },
        limit: { type: 'NUMBER', description: 'Max tests to return in the "tests" list, default 15, max 100 — does not cap "count".' },
      },
    },
  },
  {
    name: 'get_chart_data',
    description: 'Get chart-ready data for any visualization/chart/graph/plot request. Choose a metric ' +
      '(what to measure) and group_by (how to bucket it) to cover things like "pass rate over time", ' +
      '"failures by spec file", "test count by browser", "average duration by project", "duration per ' +
      'individual test", "pass vs failed pie chart", etc. IMPORTANT — group_by=date is ONLY for an explicit ' +
      'trend/over-time request; it merges every matching test into one aggregate number per date, so a ' +
      'single-day result becomes ONE bar for ALL tests combined, never separate bars per test. Use ' +
      'group_by=test instead whenever the request names "tests" (plural) as the thing to chart without a ' +
      'date/trend angle — trigger phrases include "bar graph for all failed tests", "each test", "every ' +
      'test", "per test", "individual test(s)", "which tests are slow/take longest", or "time taken for ' +
      '[each/all] failed tests" (e.g. "bar graph for all failed tests with time taken" → metric=avg_duration, ' +
      'group_by=test, status_filter=failed — NOT group_by=date). If the user gives a count, e.g. "top 5 ' +
      'tests", "top 10 slowest", "5 worst offenders", pass that count as limit — do not silently return more ' +
      'or fewer than asked. Use group_by=status (with metric=test_count, leave status_filter=all) for a ' +
      'pass/failed/skipped breakdown pie chart — do NOT try to combine two separate status_filter calls or ' +
      'invent another way to show pass-vs-fail, group_by=status already does exactly that in one call. To ' +
      'scope to ONE specific build (e.g. "in build 240003" or "for this build") pass build_id instead of ' +
      'project_name/days — build_id takes priority and ignores the date window entirely. To restrict to a ' +
      'specific spec file or folder (e.g. "smoke-check-tests", "in the login spec") pass spec_file — this ' +
      'works together with build_id/group_by, e.g. "pie of pass/fail for smoke-check-tests in build 240003" ' +
      '→ build_id=240003, spec_file="smoke-check-tests", metric=test_count, group_by=status. The dashboard ' +
      'renders the result as an actual chart automatically — reply afterward with just a short caption.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects combined). Ignored if build_id is set.' },
        build_id: { type: 'NUMBER', description: 'Scope to exactly one build by its numeric ID, instead of a project + date window.' },
        spec_file: { type: 'STRING', description: 'Restrict to spec files whose path contains this text (case-insensitive partial match), e.g. "smoke-check-tests". Combines with build_id/project_name.' },
        metric: { type: 'STRING', enum: ['pass_rate', 'failure_count', 'avg_duration', 'test_count'], description: 'What to measure' },
        group_by: { type: 'STRING', enum: ['date', 'spec_file', 'browser', 'project', 'test', 'status'], description: 'How to bucket the data — "test" for individual tests, "status" for a pass/failed/skipped pie' },
        status_filter: { type: 'STRING', enum: ['all', 'passed', 'failed', 'skipped'], description: 'Restrict to tests with this final status, default all. Use "failed" for e.g. "each failed test" — but leave as "all" when group_by=status.' },
        days: { type: 'NUMBER', description: 'Lookback window in days, default 30, max 90. Ignored if build_id is set.' },
        limit: { type: 'NUMBER', description: 'Max bars/slices to return, e.g. "top 5 tests" or "top 10 slowest" → limit=5/10. Ignored when group_by=date (every date in the window is always returned). Default 15 for most group_by, 100 for group_by=test; max 50 (100 for group_by=test).' },
      },
      required: ['metric', 'group_by'],
    },
  },
];
