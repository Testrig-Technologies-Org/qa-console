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
  const stats = { total: 0, passed: 0, failed: 0, skipped: 0, durationMs: 0 };
  for (const row of results) {
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final) continue;
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

  return { failingTests: Array.from(byKey.values()).slice(0, Math.min(limit || 10, MAX_LIMIT)) };
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

type ChartMetric = 'pass_rate' | 'failure_count' | 'avg_duration' | 'test_count';
type ChartGroupBy = 'date' | 'spec_file' | 'browser' | 'project' | 'test';
type StatusFilter = 'all' | 'passed' | 'failed' | 'skipped';

/**
 * General-purpose chart data tool — one tool covering (metric × group-by) combinations instead of
 * a hardcoded function per chart. Still fully code-driven: metric, group_by, and status_filter are
 * constrained to fixed enums in the tool declaration (Gemini can't send arbitrary strings), the
 * bucketing/aggregation logic lives here, and the chart *shape* (line/bar/pie) is picked by
 * chatChartKind() in chat-chart-types.ts from (metric, group_by) — never chosen by the model, and
 * never rendered from LLM-generated plotting code.
 */
async function getChartData({ organizationId, project_name, build_id, metric, group_by, status_filter, days }: {
  organizationId: string; project_name?: string; build_id?: number; metric: ChartMetric; group_by: ChartGroupBy; status_filter?: StatusFilter; days?: number;
}) {
  const statusWanted = status_filter && status_filter !== 'all' ? status_filter.toUpperCase() : null;

  // build_id pins to one specific build instead of a date window across builds — mutually
  // exclusive with project_name/days, and still org-scoped (a build_id from another org 404s
  // here rather than silently falling through to the all-builds path).
  let windowDays = 0;
  let scopeLabel: string;
  let rows: { tests: any; executedAt: Date | null; specFile: string; projectId: number }[];

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
    const tests = Array.isArray(row.tests) ? (row.tests as any[]) : [];
    for (const t of tests) {
      if (!t.is_final) continue;
      if (statusWanted && t.status !== statusWanted) continue;

      let key: string;
      if (group_by === 'date') key = new Date(row.executedAt as Date).toISOString().slice(0, 10);
      else if (group_by === 'spec_file') key = row.specFile;
      else if (group_by === 'browser') key = t.project || 'unknown';
      else if (group_by === 'test') key = t.title || 'Untitled test';
      else key = projectNames[row.projectId] || `Project ${row.projectId}`;

      const bucket = buckets.get(key) ?? { total: 0, passed: 0, failed: 0, durationSum: 0 };
      bucket.total++;
      if (t.status === 'PASSED') bucket.passed++;
      else if (t.status === 'FAILED') bucket.failed++;
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

  series = group_by === 'date'
    ? series.sort((a, b) => a.label.localeCompare(b.label))
    : series.sort((a, b) => b.value - a.value).slice(0, 15);

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
    description: 'Get status and pass/fail stats for one specific build by its numeric ID.',
    parameters: {
      type: 'OBJECT',
      properties: { build_id: { type: 'NUMBER', description: 'The numeric build ID' } },
      required: ['build_id'],
    },
  },
  {
    name: 'get_failing_tests',
    description: 'List currently/recently failing tests, with the build and spec file they failed in.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects)' },
        days: { type: 'NUMBER', description: 'Lookback window in days, default 7' },
        limit: { type: 'NUMBER', description: 'Max tests to return, default 10, max 20' },
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
    name: 'get_chart_data',
    description: 'Get chart-ready data for any visualization/chart/graph/plot request. Choose a metric ' +
      '(what to measure) and group_by (how to bucket it) to cover things like "pass rate over time", ' +
      '"failures by spec file", "test count by browser", "average duration by project", "duration per ' +
      'individual test", etc. Use group_by=test for anything about individual tests (e.g. "time taken for ' +
      'each failed test" → metric=avg_duration, group_by=test, status_filter=failed). To scope to ONE ' +
      'specific build (e.g. "in build 240003" or "for this build") pass build_id instead of project_name/' +
      'days — build_id takes priority and ignores the date window entirely. The dashboard renders the ' +
      'result as an actual chart automatically — reply afterward with just a short caption.',
    parameters: {
      type: 'OBJECT',
      properties: {
        project_name: { type: 'STRING', description: 'Project name to scope to (omit for all projects combined). Ignored if build_id is set.' },
        build_id: { type: 'NUMBER', description: 'Scope to exactly one build by its numeric ID, instead of a project + date window.' },
        metric: { type: 'STRING', enum: ['pass_rate', 'failure_count', 'avg_duration', 'test_count'], description: 'What to measure' },
        group_by: { type: 'STRING', enum: ['date', 'spec_file', 'browser', 'project', 'test'], description: 'How to bucket the data — use "test" to chart individual tests' },
        status_filter: { type: 'STRING', enum: ['all', 'passed', 'failed', 'skipped'], description: 'Restrict to tests with this final status, default all. Use "failed" for e.g. "each failed test".' },
        days: { type: 'NUMBER', description: 'Lookback window in days, default 30, max 90. Ignored if build_id is set.' },
      },
      required: ['metric', 'group_by'],
    },
  },
];
