'use client';
import React, { useState } from "react";
import { Database, Shield, Loader2, ChevronRight, X, CheckCircle2 } from "lucide-react";
import { createProject } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { ProjectSetupPanel } from "./ProjectSetupPanel";

export function RegisterProjectModal({ isOpen, onClose, onSuccess }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cypress',
    environment: 'production',
    description: ''
  });
  const [created, setCreated] = useState<{ id: number; apiKey: string } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreated(null);
    setFormData({ name: '', type: 'cypress', environment: 'production', description: '' });
    onClose();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createProject(formData);
      onSuccess();
      if (res.success && res.id && res.apiKey) {
        setCreated({ id: res.id, apiKey: res.apiKey });
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Registry error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm font-mono selection:bg-indigo-500/30 transition-colors duration-300">
        <div className="w-full max-w-lg bg-card border border-border rounded-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
          <div className="px-6 py-4 border-b border-border bg-muted/5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Project_Registered</span>
            </div>
            <button onClick={handleClose} className="text-muted hover:text-foreground transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto">
            <p className="text-[10px] text-muted uppercase tracking-widest leading-relaxed">
              Save these now — you&apos;ll need them to configure <span className="text-foreground font-bold">qa-console-playwright-reporter</span> in your test project.
            </p>
            <ProjectSetupPanel projectId={created.id} apiKey={created.apiKey} />
          </div>

          <div className="px-6 py-4 border-t border-border bg-muted/5 flex justify-end shrink-0">
            <button
              onClick={handleClose}
              className="px-8 py-2.5 bg-foreground text-background text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 1. BACKDROP: Uses background variable with high opacity for focus
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm font-mono selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* 2. MODAL CONTAINER */}
      <div className="w-98 bg-card border border-border rounded-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-border bg-muted/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Database size={16} className="text-indigo-500" />
            <span className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Resource_Registration_Protocol</span>
          </div>
          <button onClick={handleClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            
            {/* Project Name Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Instance Name</label>
              <input 
                required
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-background border border-border p-3 text-sm text-foreground outline-none focus:border-indigo-500 transition-all uppercase placeholder:text-muted/30"
                placeholder="e.g. CLIPPD_WEB_INSTANCE"
              />
            </div>

            {/* Grid for Type and Env */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Framework</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-background border border-border p-3 text-sm text-foreground outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="cypress">CYPRESS_ENGINE</option>
                    <option value="playwright">PLAYWRIGHT_ENGINE</option>
                  </select>
                  <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block">Environment</label>
                <div className="relative">
                  <select 
                    value={formData.environment}
                    onChange={(e) => setFormData({...formData, environment: e.target.value})}
                    className="w-full bg-background border border-border p-3 text-sm text-foreground outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="production">PRODUCTION</option>
                    <option value="staging">STAGING_VAL</option>
                    <option value="dev">DEV_GREEN</option>
                  </select>
                  <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Notice Box */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 border-l-2 border-l-indigo-500">
               <div className="flex gap-3">
                 <Shield size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-muted leading-relaxed uppercase">
                   Linking requires a generated <span className="text-indigo-500 font-bold underline">PROJECT_UUID</span>. Registering will create a unique handshake key for your CI pipeline logs.
                 </p>
               </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-8 py-6 border-t border-border bg-muted/5 flex justify-end items-center gap-6">
            <button
              type="button"
              onClick={handleClose}
              className="text-[10px] font-bold text-muted uppercase tracking-widest hover:text-foreground transition-colors"
            >
              Abort_Operation
            </button>
            <button 
              disabled={loading}
              className="px-8 py-2.5 bg-foreground text-background text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm_Registration'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}