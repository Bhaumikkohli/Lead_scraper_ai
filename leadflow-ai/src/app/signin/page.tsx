"use client";

import AuthButton from "@/components/auth/AuthButton";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const { loading, user } = useAuth();

  return (
    <div className="max-w-md mx-auto bg-[#0F1517] border border-[#1E2A29] rounded-xl p-6 shadow-[0_0_0_1px_#0CF29D20,0_0_30px_#0CF29D10]">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Sign in</div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[#9BCDBA]">
          <Loader2 className="animate-spin" size={16} />
          <span>Checking session...</span>
        </div>
      ) : user ? (
        <div className="text-sm text-[#CDE7D8]">
          You are signed in. Go to {""}
          <Link href="/" className="underline text-[#0CF29D]">dashboard</Link>.
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-[#CDE7D8]">Sign in with Google to continue.</p>
          <AuthButton />
        </div>
      )}
    </div>
  );
}

