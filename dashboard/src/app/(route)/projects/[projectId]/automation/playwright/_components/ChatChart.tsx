'use client';

import React from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_TOOL_TYPES } from "@/lib/chat-chart-types";

interface ChatChartProps {
  name: string;
  result: any;
}

/** Renders a chat tool result as an actual chart. Which shape to use is decided by tool name (CHART_TOOL_TYPES), never by the model. */
export function ChatChart({ name, result }: ChatChartProps) {
  const kind = CHART_TOOL_TYPES[name];
  if (!kind || result?.error) return null;

  if (kind === 'trend') {
    if (!Array.isArray(result.series) || result.series.length === 0) return null;
    return (
      <div className="w-full h-[180px] mt-2 bg-card border border-border rounded-xl p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={result.series}>
            <defs>
              <linearGradient id="chatTrendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }}
              formatter={(value: any, key: any) => key === 'passRate' ? [`${value}%`, 'Pass rate'] : [value, key]}
            />
            <Area type="monotone" dataKey="passRate" stroke="#10b981" strokeWidth={2} fill="url(#chatTrendGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (kind === 'breakdown') {
    if (!Array.isArray(result.breakdown) || result.breakdown.length === 0) return null;
    return (
      <div className="w-full h-[180px] mt-2 bg-card border border-border rounded-xl p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={result.breakdown} margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="specFile" tick={{ fontSize: 8, fill: 'var(--muted)' }} angle={-25} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
            <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={24} />
            <Tooltip contentStyle={{ fontSize: 11, background: 'var(--card)', border: '1px solid var(--border)' }} />
            <Bar dataKey="failures" fill="#e11d48" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
