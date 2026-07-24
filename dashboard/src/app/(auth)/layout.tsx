// app/(auth)/layout.tsx
import { Command, ShieldCheck, GitBranch, Gauge } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex bg-white text-zinc-900 -mt-2">
      {/* The dashboard shell's <main> carries an mt-2 that normally exposes the
          body's dark background above it; override --background locally so
          that sliver reads white on these light auth pages too. */}
      <style>{`:root { --background: #ffffff; }`}</style>
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative flex-col justify-between p-12 border-r border-zinc-200 bg-zinc-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')] opacity-[0.4] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.25)]">
            <Command className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-sm leading-none text-zinc-900">TestOps</h1>
            <p className="text-[8px] font-mono text-zinc-400 leading-none mt-1">v4.0.2-stable</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-8">
          <h2 className="text-4xl font-bold tracking-tight leading-[1.15] text-zinc-900">
            Automated QA,<br />engineered for scale.
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Centralize builds, coverage, and test execution across every project — Playwright and Cypress,
            unified in one console.
          </p>

          <div className="space-y-4 pt-2">
            <Feature icon={<Gauge size={14} />} label="Realtime build & execution tracking" />
            <Feature icon={<ShieldCheck size={14} />} label="Cross-project coverage analytics" />
            <Feature icon={<GitBranch size={14} />} label="Playwright & Cypress, unified" />
          </div>
        </div>

        <p className="relative z-10 text-[9px] font-mono text-zinc-400 tracking-wide">
          © {new Date().getFullYear()} AWS Industrial — Secure Access Portal
        </p>
      </div>

      {/* Auth panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.25)]">
            <Command className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xs tracking-tight text-zinc-900">TestOps</span>
        </div>

        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 flex items-center justify-center border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 shrink-0">
        {icon}
      </div>
      <span className="text-xs font-medium text-zinc-600 tracking-tight">{label}</span>
    </div>
  );
}
