'use client';

import React, { useEffect, useState } from "react";
import { Loader2, GitCompare, Clock } from "lucide-react";
import { getSimilarFailures } from "@/lib/actions";

interface SimilarFailuresProps {
  buildId: number;
  uniqueKey: string;
}

/** Run Intelligence panel: shows past failures whose embedded signature is closest to this one. */
export function SimilarFailures({ buildId, uniqueKey }: SimilarFailuresProps) {
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSimilarFailures(buildId, uniqueKey).then((res) => {
      if (cancelled) return;
      if (res.success) {
        setPending(!!res.pending);
        setSimilar(res.similar || []);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [buildId, uniqueKey]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-widest">
        <Loader2 size={12} className="animate-spin" /> Scanning failure history...
      </div>
    );
  }

  if (pending) {
    return (
      <div className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
        Embedding not generated yet — similar failures will appear here shortly.
      </div>
    );
  }

  if (similar.length === 0) {
    return (
      <div className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
        No similar past failures found yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest px-1">
        <GitCompare size={14} /> Similar Past Failures
      </div>
      <div className="space-y-2">
        {similar.map((s: any) => (
          <div key={s.id} className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{s.title}</p>
              <div className="flex items-center gap-3 mt-1 text-[9px] text-muted font-bold uppercase tracking-widest">
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
