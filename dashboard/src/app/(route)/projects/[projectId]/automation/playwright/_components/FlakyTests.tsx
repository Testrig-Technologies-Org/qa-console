'use client';

import React, { useEffect, useState } from "react";
import { Loader2, Shuffle, Clock } from "lucide-react";
import { getFlakyTests } from "@/lib/actions";

interface FlakyTestsProps {
  projectId: number;
}

/** Run Intelligence panel: tests that needed a retry to eventually pass, ranked by flake rate across recent build history for this project. */
export function FlakyTests({ projectId }: FlakyTestsProps) {
  const [loading, setLoading] = useState(true);
  const [flaky, setFlaky] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getFlakyTests(projectId).then((res) => {
      if (cancelled) return;
      if (res.success) setFlaky(res.flaky || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold tracking-wide p-6">
        <Loader2 size={12} className="animate-spin" /> Scanning build history...
      </div>
    );
  }

  if (flaky.length === 0) {
    return (
      <div className="p-6 text-[10px] text-muted font-bold tracking-wide opacity-60">
        No flaky tests detected in the last 60 days.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {flaky.map((t: any) => (
        <div key={`${t.specFile}::${t.title}`} className="p-6 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">{t.title}</p>
            <div className="flex items-center gap-3 mt-1.5 text-[9px] text-muted font-bold tracking-wide">
              <span className="truncate max-w-[220px]">{t.specFile}</span>
              <span className="w-1 h-1 bg-border rounded-full shrink-0" />
              <span>{t.flakyRuns}/{t.totalRuns} runs flaky</span>
              <span className="w-1 h-1 bg-border rounded-full shrink-0" />
              <span className="flex items-center gap-1 shrink-0"><Clock size={10} className="opacity-50" /> {new Date(t.lastSeen).toLocaleDateString()}</span>
            </div>
          </div>
          <span className="shrink-0 flex items-center gap-1.5 text-[9px] font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <Shuffle size={11} /> {t.flakeRate}% flaky
          </span>
        </div>
      ))}
    </div>
  );
}
