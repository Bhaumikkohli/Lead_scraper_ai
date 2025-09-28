"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function SignInPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center">
      <div className="w-full max-w-md bg-[#0F1517] border border-[#1E2A29] rounded-xl p-6">
        <div className="text-lg font-semibold mb-4">Sign in</div>
        {error && <div className="text-sm text-rose-400 mb-3">{error}</div>}
        <form onSubmit={handleEmailSignIn} className="space-y-3">
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <button disabled={loading} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <button onClick={handleGoogle} disabled={loading} className="mt-3 w-full border border-[#1E2A29] text-[#CDE7D8] rounded-md py-2 text-sm hover:border-[#0CF29D]/50 transition">Continue with Google</button>
        <div className="mt-4 text-xs text-[#9BCDBA]">
          No account? <Link className="text-[#0CF29D]" href="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

