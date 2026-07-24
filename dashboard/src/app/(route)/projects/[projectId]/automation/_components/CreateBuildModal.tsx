'use client';
import React, { useState } from "react";
import { Check, ChevronRight, Copy, GitMerge, Loader2, Terminal, X } from "lucide-react";
import { createManualBuild } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface CreateBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onCreated?: () => void;
}

export function CreateBuildModal({ isOpen, onClose, projectId, onCreated }: CreateBuildModalProps) {
  const [environment, setEnvironment] = useState('production');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ buildId: number; sessionId: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreated(null);
    setError(null);
    setEnvironment('production');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await createManualBuild(projectId, environment);
      if (res.success && res.buildId && res.sessionId) {
        setCreated({ buildId: res.buildId, sessionId: res.sessionId });
        onCreated?.();
      } else {
        setError(res.error || 'Failed to create build');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create build');
    } finally {
      setLoading(false);
    }
  };

  const envVarSnippet = created ? `export QA_CONSOLE_SESSION_ID="${created.sessionId}"` : '';

  const copySnippet = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(envVarSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (created) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm font-mono selection:bg-indigo-500/30 transition-colors duration-300">
        <div className="w-full max-w-lg bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-muted/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <GitMerge size={16} className="text-indigo-500" />
              <span className="text-[11px] font-black text-foreground tracking-wide">Combined Build Ready</span>
            </div>
            <button onClick={handleClose} className="text-muted hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto">
            <p className="text-[10px] text-muted tracking-wide leading-relaxed">
              Build_Reference_{created.buildId} is waiting. Set this session key in your CI environment
              <span className="text-foreground font-bold"> before</span> running your shards/workers — every
              process that reports with it lands in this same build instead of creating its own.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-muted tracking-wide flex items-center gap-2">
                  <Terminal size={12} /> CI Environment Variable
                </label>
                <button
                  type="button"
                  onClick={copySnippet}
                  className={cn(
                    "px-3 py-1.5 border transition-colors flex items-center gap-1.5 text-[10px] font-bold tracking-wide",
                    copied
                      ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/5"
                      : "border-border bg-background text-muted hover:text-foreground"
                  )}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="bg-background border border-border p-4 text-xs font-mono text-foreground overflow-x-auto whitespace-pre">
{envVarSnippet}
              </pre>
              <p className="text-[9px] text-muted tracking-wide leading-relaxed">
                Or pass it as the reporter&apos;s <span className="text-foreground font-bold">sessionId</span> option
                in playwright.config.ts. A build left idle for ~30 minutes with no reported results is
                auto-marked failed, so start your run reasonably soon after creating it.
              </p>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/5 flex justify-end shrink-0">
            <button
              onClick={handleClose}
              className="px-8 py-2.5 bg-foreground text-background text-[11px] font-black tracking-wide hover:opacity-90 transition-all shadow-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm font-mono selection:bg-indigo-500/30 transition-colors duration-300">
      <div className="w-98 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border bg-muted/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GitMerge size={16} className="text-indigo-500" />
            <span className="text-[11px] font-black text-foreground tracking-wide">Create Combined Build</span>
          </div>
          <button onClick={handleClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <p className="text-[10px] text-muted tracking-wide leading-relaxed">
              Pre-creates a build and issues a session key. Skip this to let each CI process keep
              creating its own separate build, same as before.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted tracking-wide block">Environment</label>
              <div className="relative">
                <select
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  className="w-full bg-background border border-border p-3 text-sm text-foreground outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging Val</option>
                  <option value="dev">Dev Green</option>
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted pointer-events-none" />
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-rose-500 tracking-wide">{error}</p>
            )}
          </div>

          <div className="px-8 py-6 border-t border-border bg-muted/5 flex justify-end items-center gap-6">
            <button
              type="button"
              onClick={handleClose}
              className="text-[10px] font-bold text-muted tracking-wide hover:text-foreground transition-colors"
            >Abort Operation</button>
            <button
              disabled={loading}
              className="px-8 py-2.5 bg-foreground text-background text-[11px] font-black tracking-wide hover:opacity-90 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Create_Build'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
