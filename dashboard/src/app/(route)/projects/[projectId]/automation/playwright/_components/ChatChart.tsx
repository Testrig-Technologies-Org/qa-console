'use client';

import React from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { chatChartKind } from "@/lib/chat-chart-types";

interface ChatChartProps {
  name: string;
  args?: Record<string, any>;
  result: any;
}

const METRIC_LABELS: Record<string, string> = {
  pass_rate: 'Pass rate (%)',
  failure_count: 'Failures',
  avg_duration: 'Avg duration (ms)',
  test_count: 'Test count',
};

const GROUP_BY_LABELS: Record<string, string> = {
  date: 'over time', spec_file: 'by spec file', browser: 'by browser', project: 'by project', test: 'by test',
};

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#e11d48', '#0ea5e9', '#a855f7', '#84cc16', '#f97316'];

/** Built directly from the tool result's own fields, never from the model's freeform reply — so
 * the chart stays accurate to what was actually queried even if the model's prose caption isn't. */
function ChartHeader({ result }: { result: any }) {
  const metricLabel = METRIC_LABELS[result.metric] || result.metric;
  const groupLabel = GROUP_BY_LABELS[result.group_by] || result.group_by;
  const statusLabel = result.status_filter && result.status_filter !== 'all' ? `${result.status_filter} tests only` : null;

  return (
    <div className="px-1 mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-muted uppercase tracking-widest">
      <span className="text-foreground">{metricLabel}</span>
      <span className="opacity-50">{groupLabel}</span>
      {statusLabel && <span className="text-amber-600 dark:text-amber-500">{statusLabel}</span>}
      <span className="opacity-40">· {result.scope}</span>
    </div>
  );
}

/** Renders a get_chart_data result as an actual chart. Shape (line/bar/pie) is decided by chatChartKind — never by the model. */
export function ChatChart({ name, args, result }: ChatChartProps) {
  const kind = chatChartKind(name, args);
  if (!kind || result?.error || !Array.isArray(result?.series) || result.series.length === 0) return null;

  const metricLabel = METRIC_LABELS[result.metric] || result.metric;

  let chart: React.ReactNode;
  let height = 200;

  if (kind === 'line') {
    chart = (
      <AreaChart data={result.series}>
        <defs>
          <linearGradient id="chatTrendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={34} />
        <Tooltip
          contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
          formatter={(value: any) => [value, metricLabel]}
        />
        <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#chatTrendGrad)" />
      </AreaChart>
    );
  } else if (kind === 'pie') {
    height = 220;
    chart = (
      <PieChart>
        <Pie data={result.series} dataKey="value" nameKey="label" cx="50%" cy="45%" innerRadius={40} outerRadius={65} paddingAngle={3} stroke="none">
          {result.series.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }} />
        <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }} />
      </PieChart>
    );
  } else {
    chart = (
      <BarChart data={result.series} margin={{ bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tick={{ fontSize: 8, fill: 'var(--muted)' }} angle={-25} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={30} />
        <Tooltip contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }} formatter={(value: any) => [value, metricLabel]} />
        <Bar dataKey="value" fill="#e11d48" radius={[2, 2, 0, 0]} />
      </BarChart>
    );
  }

  return (
    <div className="w-full mt-2">
      <ChartHeader result={result} />
      <div className="bg-card border border-border rounded-xl p-3" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {chart as any}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
