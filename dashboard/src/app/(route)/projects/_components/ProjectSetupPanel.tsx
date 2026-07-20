'use client';
import React, { useState } from "react";
import { Check, Copy, Eye, EyeOff, KeyRound, RefreshCw, Terminal } from "lucide-react";
import { regenerateProjectApiKey } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface ProjectSetupPanelProps {
  projectId: number;
  apiKey: string;
  onKeyRegenerated?: (newKey: string) => void;
}

export function ProjectSetupPanel({ projectId, apiKey, onKeyRegenerated }: ProjectSetupPanelProps) {
  const [revealed, setRevealed] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  const envSnippet = [
    `QA_CONSOLE_URL=${appUrl}`,
    `QA_CONSOLE_API_KEY=${apiKey}`,
    `QA_CONSOLE_PROJECT_ID=${projectId}`,
  ].join("\n");

  const copy = async (field: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 1500);
  };

  const handleRegenerate = async () => {
    if (!confirm("Regenerate this project's API key? The old key will stop working immediately.")) return;
    setRegenerating(true);
    try {
      const res = await regenerateProjectApiKey(projectId);
      if (res.success && res.apiKey) {
        onKeyRegenerated?.(res.apiKey);
        setRevealed(true);
      }
    } finally {
      setRegenerating(false);
    }
  };

  const maskedKey = apiKey.length > 12 ? `${apiKey.slice(0, 8)}${"•".repeat(20)}${apiKey.slice(-4)}` : apiKey;

  return (
    <div className="bg-card border border-border rounded-none">
      <div className="px-6 py-4 border-b border-border bg-muted/5 flex items-center gap-3">
        <KeyRound size={14} className="text-indigo-500" />
        <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Playwright_Setup_Credentials</span>
      </div>

      <div className="p-6 space-y-5">
        <Field label="App URL" value={appUrl} onCopy={() => copy("baseUrl", appUrl)} copied={copiedField === "baseUrl"} />
        <Field label="Project ID" value={String(projectId)} onCopy={() => copy("projectId", String(projectId))} copied={copiedField === "projectId"} />

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">API Key</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-background border border-border px-3 py-2.5 text-sm font-mono text-foreground truncate">
              {revealed ? apiKey : maskedKey}
            </div>
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="p-2.5 border border-border bg-background text-muted hover:text-foreground transition-colors"
              title={revealed ? "Hide" : "Reveal"}
            >
              {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <CopyButton onClick={() => copy("apiKey", apiKey)} copied={copiedField === "apiKey"} />
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="p-2.5 border border-border bg-background text-muted hover:text-rose-500 hover:border-rose-500/40 transition-colors disabled:opacity-50"
              title="Regenerate key"
            >
              <RefreshCw size={14} className={cn(regenerating && "animate-spin")} />
            </button>
          </div>
          <p className="text-[9px] text-muted uppercase tracking-widest">Treat this like a password — anyone with it can submit results to this project.</p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} /> playwright-tests/.env
            </label>
            <CopyButton onClick={() => copy("env", envSnippet)} copied={copiedField === "env"} label="Copy_All" />
          </div>
          <pre className="bg-background border border-border p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
{envSnippet.replace(`QA_CONSOLE_API_KEY=${apiKey}`, `QA_CONSOLE_API_KEY=${revealed ? apiKey : maskedKey}`)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onCopy, copied }: { label: string; value: string; onCopy: () => void; copied: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-background border border-border px-3 py-2.5 text-sm font-mono text-foreground truncate">
          {value}
        </div>
        <CopyButton onClick={onCopy} copied={copied} />
      </div>
    </div>
  );
}

function CopyButton({ onClick, copied, label }: { onClick: () => void; copied: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2.5 border transition-colors flex items-center gap-1.5 shrink-0",
        copied
          ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/5"
          : "border-border bg-background text-muted hover:text-foreground",
        label && "px-3 text-[10px] font-bold uppercase tracking-widest"
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}
