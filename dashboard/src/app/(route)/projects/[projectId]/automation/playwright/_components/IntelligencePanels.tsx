'use client';

import React, { useState } from "react";
import { GitCompare, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlakyTests } from "./FlakyTests";
import { FailureCorrelationList } from "./FailureCorrelationList";

interface IntelligencePanelsProps {
  projectId: number;
  buildId?: number;
  failedTests: { uniqueKey: string; title: string }[];
}

type Tab = 'flaky' | 'correlation';

/**
 * Flaky_Test_Radar and Failure_Correlation combined into one card with a tab switch instead of
 * two separate always-expanded sections — both lists render inside a fixed-height scrollable
 * area so a project with a long history doesn't stretch the page indefinitely.
 */
export function IntelligencePanels({ projectId, buildId, failedTests }: IntelligencePanelsProps) {
  const [tab, setTab] = useState<Tab>('flaky');

  return (
    <div className="bg-background border border-border rounded-none font-mono shadow-2xl overflow-hidden">
      <div className="flex items-center border-b border-border bg-card/50">
        <TabButton active={tab === 'flaky'} onClick={() => setTab('flaky')} icon={<Shuffle size={14} />} label="Flaky_Test_Radar" />
        <TabButton active={tab === 'correlation'} onClick={() => setTab('correlation')} icon={<GitCompare size={14} />} label="Failure_Correlation" disabled={failedTests.length === 0} />
      </div>
      <div className="max-h-[420px] overflow-y-auto">
        {/* Both tabs stay mounted (toggled via CSS) so switching back and forth never re-fetches
            — each list's data is fetched once and kept for the rest of the page visit. */}
        <div className={cn(tab !== 'flaky' && 'hidden')}>
          <FlakyTests projectId={projectId} />
        </div>
        <div className={cn(tab !== 'correlation' && 'hidden')}>
          {buildId && failedTests.length > 0
            ? <FailureCorrelationList buildId={buildId} failedTests={failedTests} />
            : <div className="p-6 text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">No failures in this build.</div>}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, disabled }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        active
          ? "border-foreground text-foreground bg-background"
          : "border-transparent text-muted hover:text-foreground"
      )}
    >
      {icon} {label}
    </button>
  );
}
