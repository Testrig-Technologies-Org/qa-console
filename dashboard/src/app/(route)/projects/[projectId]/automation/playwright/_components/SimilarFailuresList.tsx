'use client';

import React from "react";
import { GitCompare, Clock } from "lucide-react";

interface SimilarFailuresListProps {
  similar: any[];
  pending?: boolean;
}

/** Pure presentational rendering of a similar-failures result — no fetching. Used both by
 * SimilarFailures (self-fetching, single test) and FailureCorrelationList (batch-fetched). */
export function SimilarFailuresList({ similar, pending }: SimilarFailuresListProps) {
  if (pending) {
    return (
      <div className="text-[10px] text-muted font-bold tracking-wide opacity-60">
        Embedding not generated yet — similar failures will appear here shortly.
      </div>
    );
  }

  if (!similar || similar.length === 0) {
    return (
      <div className="text-[10px] text-muted font-bold tracking-wide opacity-60">
        No similar past failures found yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black tracking-wide px-1">
        <GitCompare size={14} /> Similar Past Failures
      </div>
      <div className="space-y-2">
        {similar.map((s: any) => (
          <div key={s.id} className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{s.title}</p>
              <div className="flex items-center gap-3 mt-1 text-[9px] text-muted font-bold tracking-wide">
                <span>Build_Reference_{s.build_id}</span>
                <span className="flex items-center gap-1"><Clock size={10} className="opacity-50" /> {new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <span className="shrink-0 text-[9px] font-black text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full">
              {Math.round((1 - s.distance) * 100)}% match
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
