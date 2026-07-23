// Decides which chart shape a chat tool result renders as — kept in its own file (no DB/server
// imports) so client components can import it without pulling in chat-tools.ts's database driver.
// The shape is always decided here, by code, from the tool's own arguments — never chosen by the
// model itself, and never rendered from LLM-generated plotting code.
export type ChatChartKind = 'line' | 'bar' | 'pie';

export function chatChartKind(toolName: string, args: Record<string, any> | undefined): ChatChartKind | null {
  if (toolName !== 'get_chart_data' || !args) return null;
  const { metric, group_by } = args;
  if (group_by === 'date') return 'line';
  if (metric === 'test_count' && (group_by === 'project' || group_by === 'browser')) return 'pie';
  return 'bar';
}
