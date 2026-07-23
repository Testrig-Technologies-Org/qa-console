'use client';

import React, { useEffect, useState } from "react";
import { Bug, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { getSimilarFailuresForBuild } from "@/lib/actions";
import { SimilarFailuresList } from "./SimilarFailuresList";

interface FailedTest {
  uniqueKey: string;
  title: string;
}

interface FailureCorrelationListProps {
  buildId: number;
  failedTests: FailedTest[];
}

interface Bucket {
  indexed: boolean;
  pending: boolean;
  similar: any[];
}

/**
 * Collapsed-by-default accordion over a build's failed tests, each expandable to show its
 * similar-past-failures matches. Fetches every failed test's matches in a single batched call
 * (getSimilarFailuresForBuild) up front, so expanding a row is instant — no per-row network call.
 */
export function FailureCorrelationList({ buildId, failedTests }: FailureCorrelationListProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, Bucket>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSimilarFailuresForBuild(buildId).then((res) => {
      if (cancelled) return;
      if (res.success) setData(res.byKey || {});
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [buildId]);

  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest p-6">
        <Loader2 size={12} className="animate-spin" /> Scanning failure history...
      </div>
    );
  }

  const withMatches = failedTests.filter((t) => (data[t.uniqueKey]?.similar.length ?? 0) > 0).length;

  return (
    <div>
      <div className="px-6 py-2.5 border-b border-border bg-muted/5 text-[9px] font-bold text-muted uppercase tracking-widest">
        {failedTests.length} failure{failedTests.length === 1 ? '' : 's'} analyzed · {withMatches} with a similar past match
      </div>
      <div className="divide-y divide-border">
      {failedTests.map((t) => {
        const bucket = data[t.uniqueKey];
        const matchCount = bucket?.similar.length ?? 0;
        const isOpen = expanded.has(t.uniqueKey);

        return (
          <div key={t.uniqueKey}>
            <button
              onClick={() => toggle(t.uniqueKey)}
              className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-muted/5 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Bug size={14} className="text-rose-600 dark:text-rose-500 shrink-0" />
                <span className="text-xs font-bold text-foreground uppercase tracking-tight truncate">{t.title}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {matchCount > 0 && (
                  <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    {matchCount} match{matchCount === 1 ? '' : 'es'}
                  </span>
                )}
                {bucket?.pending && (
                  <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-60">Pending</span>
                )}
                {isOpen ? <ChevronDown size={14} className="text-muted" /> : <ChevronRight size={14} className="text-muted" />}
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-200">
                <SimilarFailuresList similar={bucket?.similar ?? []} pending={bucket?.pending} />
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
