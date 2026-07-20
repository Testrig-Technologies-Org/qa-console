// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "../../_appearance";

export default function SignUpPage() {
  return (
    <div className="w-full space-y-8">
      <div>
        <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-[0.2em] mb-2">
          Get Started
        </p>
        <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Create an account</h2>
        <p className="text-xs text-zinc-500 mt-1.5">Register to access the QA console.</p>
      </div>
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
