import type { Appearance } from "@clerk/types";

export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#4f46e5",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#18181b",
    colorText: "#18181b",
    colorTextSecondary: "#71717a",
    colorDanger: "#e11d48",
    borderRadius: "0px",
    fontSize: "13px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full bg-white border border-zinc-200 shadow-lg shadow-zinc-200/60",
    card: "w-full bg-transparent shadow-none p-8 gap-6",
    header: "!hidden",
    socialButtonsBlockButton:
      "border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 rounded-none h-10 text-xs font-bold uppercase tracking-widest transition-colors",
    socialButtonsBlockButtonText: "text-xs font-bold uppercase tracking-widest",
    dividerRow: "my-2",
    dividerLine: "bg-zinc-200",
    dividerText: "text-zinc-400 text-[9px] font-bold uppercase tracking-[0.2em]",
    formFieldLabel: "text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1.5",
    formFieldInput:
      "bg-white border border-zinc-300 rounded-none text-zinc-900 h-10 text-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/30 transition-colors",
    formFieldInputShowPasswordButton: "text-zinc-400 hover:text-zinc-700",
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-500 rounded-none h-10 text-xs font-bold uppercase tracking-[0.15em] shadow-[0_0_15px_rgba(79,70,229,0.25)] transition-all",
    footerAction: "text-center",
    footerActionText: "text-zinc-500 text-xs",
    footerActionLink: "text-indigo-600 hover:text-indigo-500 font-bold",
    footer: "bg-transparent",
    identityPreview: "bg-zinc-50 border border-zinc-200 rounded-none",
    identityPreviewText: "text-zinc-700 text-xs",
    identityPreviewEditButton: "text-indigo-600 hover:text-indigo-500",
    formResendCodeLink: "text-indigo-600 hover:text-indigo-500 font-bold",
    otpCodeFieldInput: "bg-white border-zinc-300 text-zinc-900 rounded-none",
    alert: "bg-rose-50 border border-rose-200 rounded-none text-rose-600",
    alertText: "text-rose-600 text-xs",
    formFieldSuccessText: "text-emerald-600 text-xs",
    formFieldErrorText: "text-rose-600 text-xs",
    formFieldAction: "text-indigo-600 hover:text-indigo-500 text-xs font-bold",
    poweredByClerk: "!hidden",
  },
};
