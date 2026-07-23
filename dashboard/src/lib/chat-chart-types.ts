// Which chat tool results render as a chart, and which chart shape — kept in its own file
// (no DB/server imports) so client components can import it without pulling in chat-tools.ts's
// database driver. The chart type is decided here, by code, never chosen by the model.
export const CHART_TOOL_TYPES: Record<string, 'trend' | 'breakdown'> = {
  get_pass_rate_trend: 'trend',
  get_failure_breakdown: 'breakdown',
};
