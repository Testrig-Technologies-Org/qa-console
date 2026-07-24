'use client';

import React, { useId, useState } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, Loader2, Pin } from "lucide-react";
import { chatChartKind, chatChartColor, chatStatusSliceColor } from "@/lib/chat-chart-types";
import { pinChart } from "@/lib/chat";
import { cn } from "@/lib/utils";

interface ChatChartProps {
  name: string;
  args?: Record<string, any>;
  result: any;
  projectId?: number;
  onPinned?: () => void;
}

const METRIC_LABELS: Record<string, string> = {
  pass_rate: 'Pass rate (%)',
  failure_count: 'Failures',
  avg_duration: 'Avg duration (ms)',
  test_count: 'Test count',
};

const GROUP_BY_LABELS: Record<string, string> = {
  date: 'over time', spec_file: 'by spec file', browser: 'by browser', project: 'by project', test: 'by test', status: 'by status',
};

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#e11d48', '#0ea5e9', '#a855f7', '#84cc16', '#f97316'];

// group_by=test labels are full test titles (sometimes full sentences) — rotating them at an
// angle doesn't make a 80-character string fit, it just overlaps illegibly. Truncate for the
// axis tick; the full title is still available in the tooltip on hover.
const MAX_AXIS_LABEL_LENGTH = 18;
function truncateAxisLabel(value: string): string {
  if (!value || value.length <= MAX_AXIS_LABEL_LENGTH) return value;
  return `${value.slice(0, MAX_AXIS_LABEL_LENGTH - 1)}…`;
}

// Duration values are in milliseconds and can run into the millions — with no formatting and a
// 30px-wide axis, large numbers were rendering visually clipped (e.g. "00000"). Compact notation
// (1.6M, 800K) both reads better and actually fits.
const axisNumberFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
function formatAxisNumber(value: number): string {
  return axisNumberFormatter.format(value);
}

/** Same text used for both the on-chart header and the title stored when pinning — keeps a
 * pinned chart's label trustworthy (built from the actual query args) rather than the model's
 * possibly-inaccurate caption. */
export function buildChartTitle(result: any): string {
  const metricLabel = METRIC_LABELS[result.metric] || result.metric;
  const groupLabel = GROUP_BY_LABELS[result.group_by] || result.group_by;
  const statusLabel = result.status_filter && result.status_filter !== 'all' ? ` (${result.status_filter} only)` : '';
  return `${metricLabel} ${groupLabel}${statusLabel} · ${result.scope}`;
}

/** Built directly from the tool result's own fields, never from the model's freeform reply — so
 * the chart stays accurate to what was actually queried even if the model's prose caption isn't. */
function ChartHeader({ result, pinButton }: { result: any; pinButton?: React.ReactNode }) {
  const metricLabel = METRIC_LABELS[result.metric] || result.metric;
  const groupLabel = GROUP_BY_LABELS[result.group_by] || result.group_by;
  const statusLabel = result.status_filter && result.status_filter !== 'all' ? `${result.status_filter} tests only` : null;

  return (
    <div className="px-1 mb-1.5 flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-muted tracking-wide">
        <span className="text-foreground">{metricLabel}</span>
        <span className="opacity-50">{groupLabel}</span>
        {statusLabel && <span className="text-amber-600 dark:text-amber-500">{statusLabel}</span>}
        <span className="opacity-40">· {result.scope}</span>
      </div>
      {pinButton}
    </div>
  );
}

/** Renders a get_chart_data result as an actual chart. Shape (line/bar/pie) is decided by chatChartKind — never by the model. */
export function ChatChart({ name, args, result, projectId, onPinned }: ChatChartProps) {
  let kind = chatChartKind(name, args);
  const gradientId = useId();
  const [pinState, setPinState] = useState<'idle' | 'pinning' | 'pinned'>('idle');
  if (!kind || result?.error || !Array.isArray(result?.series) || result.series.length === 0) return null;

  // A line/area chart needs at least a few points to show a trend — with 1-2 (e.g. group_by=date
  // scoped to a single build, which only ever spans one date) it renders as an isolated floating
  // dot instead. A bar chart reads correctly at any count, so fall back to that instead.
  if (kind === 'line' && result.series.length < 3) kind = 'bar';

  const metricLabel = METRIC_LABELS[result.metric] || result.metric;
  const color = chatChartColor(args); // green for passed data, red for failed, neutral otherwise — decided by code from args, not the model

  const handlePin = async () => {
    if (!projectId || pinState !== 'idle') return;
    setPinState('pinning');
    const res = await pinChart(projectId, buildChartTitle(result), name, args || {});
    if (res.success) {
      setPinState('pinned');
      onPinned?.();
    } else {
      setPinState('idle');
    }
  };

  const pinButton = projectId ? (
    <button
      onClick={handlePin}
      disabled={pinState !== 'idle'}
      title={pinState === 'pinned' ? 'Pinned to dashboard' : 'Add to dashboard'}
      className={cn(
        "shrink-0 flex items-center gap-1 px-2 py-1 text-[9px] font-bold tracking-wide border rounded-full transition-colors",
        pinState === 'pinned'
          ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5"
          : "text-muted border-border hover:text-indigo-500 hover:border-indigo-500/40"
      )}
    >
      {pinState === 'pinning' ? <Loader2 size={10} className="animate-spin" /> : pinState === 'pinned' ? <Check size={10} /> : <Pin size={10} />}
      {pinState === 'pinned' ? 'Pinned' : 'Add'}
    </button>
  ) : null;

  let chart: React.ReactNode;
  let height = 220;

  if (kind === 'line') {
    chart = (
      <AreaChart data={result.series}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={44} tickFormatter={formatAxisNumber} />
        <Tooltip
          contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
          formatter={(value: any) => [value.toLocaleString(), metricLabel]}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
      </AreaChart>
    );
  } else if (kind === 'pie') {
    height = 260;
    const isStatusPie = result.group_by === 'status';
    // Status labels come straight from the DB's enum values (PASSED/FAILED/SKIPPED) — title-case
    // them for display rather than relying on a forced-CSS transform.
    const pieSeries = isStatusPie
      ? result.series.map((s: any) => ({ ...s, label: s.label ? s.label[0] + s.label.slice(1).toLowerCase() : s.label }))
      : result.series;
    chart = (
      <PieChart margin={{ bottom: 8 }}>
        <Pie data={pieSeries} dataKey="value" nameKey="label" cx="50%" cy="42%" innerRadius={38} outerRadius={60} paddingAngle={3} stroke="none">
          {result.series.map((s: any, i: number) => (
            <Cell key={i} fill={isStatusPie ? chatStatusSliceColor(s.label) : PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: 9, fontWeight: 700, paddingTop: 12 }} />
      </PieChart>
    );
  } else {
    height = 340;
    chart = (
      <BarChart data={result.series} margin={{ bottom: 56, left: 4, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 8, fill: 'var(--muted)' }} tickFormatter={truncateAxisLabel} angle={-35} textAnchor="end" height={70} axisLine={false} tickLine={false} interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={44} tickFormatter={formatAxisNumber} />
        <Tooltip
          contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
          formatter={(value: any) => [value.toLocaleString(), metricLabel]}
        />
        <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
      </BarChart>
    );
  }

  // group_by=test can return dozens of bars (uncapped, unlike other group_bys) — squeezing them
  // all into a fixed width makes every label and bar illegible. Give each bar a minimum width and
  // let the chart scroll horizontally instead of shrinking.
  const minBarChartWidth = kind === 'bar' ? Math.max(result.series.length * 44, 100) : undefined;

  return (
    <div className="w-full mt-2">
      <ChartHeader result={result} pinButton={pinButton} />
      <div className="bg-card border border-border rounded-xl p-3 pb-4 overflow-x-auto" style={{ height }}>
        <div style={minBarChartWidth ? { minWidth: minBarChartWidth, height: '100%' } : { height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {chart as any}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
