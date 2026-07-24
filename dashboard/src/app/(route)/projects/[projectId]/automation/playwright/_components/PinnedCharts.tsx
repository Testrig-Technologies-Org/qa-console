'use client';

import React, { useEffect, useState } from "react";
import { Loader2, Pin, X } from "lucide-react";
import { getPinnedCharts, unpinChart } from "@/lib/chat";
import { ChatChart } from "./ChatChart";

interface PinnedChart {
  id: number;
  title: string;
  name: string;
  args: Record<string, any>;
  result: any;
}

export interface PinnedChartsHandle {
  refresh: () => void;
}

/** Charts pinned from Ask_Intelligence onto this project's dashboard. Each re-runs its saved
 * query live on load (via getPinnedCharts → executeTool) rather than showing a stale snapshot. */
export const PinnedCharts = React.forwardRef<PinnedChartsHandle, { projectId: number }>(({ projectId }, ref) => {
  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState<PinnedChart[]>([]);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getPinnedCharts(projectId).then((res) => {
      if (res.success) setCharts(res.charts as PinnedChart[]);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [projectId]);
  React.useImperativeHandle(ref, () => ({ refresh: load }));

  const handleRemove = async (id: number) => {
    setRemovingId(id);
    const res = await unpinChart(id);
    if (res.success) setCharts((prev) => prev.filter((c) => c.id !== id));
    setRemovingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold tracking-wide p-6">
        <Loader2 size={12} className="animate-spin" /> Loading pinned charts...
      </div>
    );
  }

  if (charts.length === 0) {
    return (
      <div className="p-6 text-[10px] text-muted font-bold tracking-wide opacity-60">
        No pinned charts yet — click Add on a chart in Ask_Intelligence to save it here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
      {charts.map((c) => (
        <div key={c.id} className="relative bg-background border border-border rounded-xl p-4 pb-5">
          <button
            onClick={() => handleRemove(c.id)}
            disabled={removingId === c.id}
            title="Remove from dashboard"
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-card border border-border text-muted hover:text-rose-500 hover:border-rose-500/40 transition-colors disabled:opacity-50"
          >
            {removingId === c.id ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
          </button>
          <ChatChart name={c.name} args={c.args} result={c.result} />
        </div>
      ))}
    </div>
  );
});
PinnedCharts.displayName = 'PinnedCharts';
