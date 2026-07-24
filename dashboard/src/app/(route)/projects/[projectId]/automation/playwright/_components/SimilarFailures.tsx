'use client';

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSimilarFailures } from "@/lib/actions";
import { SimilarFailuresList } from "./SimilarFailuresList";

interface SimilarFailuresProps {
  buildId: number;
  uniqueKey: string;
}

/** Run Intelligence panel: fetches and shows past failures whose embedded signature is closest to this one. */
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
      <div className="flex items-center gap-2 text-muted text-[10px] font-bold tracking-wide">
        <Loader2 size={12} className="animate-spin" /> Scanning failure history...
      </div>
    );
  }

  return <SimilarFailuresList similar={similar} pending={pending} />;
}
