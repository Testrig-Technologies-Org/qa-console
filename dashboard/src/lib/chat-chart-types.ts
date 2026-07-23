// Decides which chart shape a chat tool result renders as — kept in its own file (no DB/server
// imports) so client components can import it without pulling in chat-tools.ts's database driver.
// The shape is always decided here, by code, from the tool's own arguments — never chosen by the
// model itself, and never rendered from LLM-generated plotting code.
export type ChatChartKind = 'line' | 'bar' | 'pie';

export function chatChartKind(toolName: string, args: Record<string, any> | undefined): ChatChartKind | null {
  if (toolName !== 'get_chart_data' || !args) return null;
  const { metric, group_by } = args;
  if (group_by === 'status') return 'pie'; // a status breakdown (pass/fail/skip share of whole) is inherently categorical
  if (group_by === 'date') return 'line';
  if (metric === 'test_count' && (group_by === 'project' || group_by === 'browser')) return 'pie';
  return 'bar';
}

const GREEN = '#10b981';
const RED = '#e11d48';
const AMBER = '#f59e0b';
const NEUTRAL = '#6366f1';

/** Line/bar color — green for passed data, red for failed, neutral otherwise. Decided from the
 * tool's own args (status_filter takes priority over metric), never from the model's chart choice. */
export function chatChartColor(args: Record<string, any> | undefined): string {
  const statusFilter = args?.status_filter;
  if (statusFilter === 'passed') return GREEN;
  if (statusFilter === 'failed') return RED;
  if (args?.metric === 'failure_count') return RED;
  if (args?.metric === 'pass_rate') return GREEN;
  return NEUTRAL;
}

/** Per-slice color for a group_by=status pie — PASSED green, FAILED red, SKIPPED amber, anything else neutral. */
export function chatStatusSliceColor(label: string): string {
  const s = label?.toUpperCase();
  if (s === 'PASSED') return GREEN;
  if (s === 'FAILED') return RED;
  if (s === 'SKIPPED') return AMBER;
  return NEUTRAL;
}
