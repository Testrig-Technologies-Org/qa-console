// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "../../_appearance";

export default function SignInPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2">
          Secure Access
        </p>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Welcome back</h2>
        <p className="text-xs text-zinc-500 mt-1.5">Sign in to continue to your console.</p>
      </div>
      <SignIn appearance={clerkAppearance} />
    </div>
  );
}
