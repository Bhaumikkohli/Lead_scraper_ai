"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function SignUpPage() {
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.message ?? "Failed to sign up");
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
      setError(e?.message ?? "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid place-items-center">
      <div className="w-full max-w-md bg-[#0F1517] border border-[#1E2A29] rounded-xl p-6">
        <div className="text-lg font-semibold mb-4">Create account</div>
        {error && <div className="text-sm text-rose-400 mb-3">{error}</div>}
        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <button disabled={loading} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <button onClick={handleGoogle} disabled={loading} className="mt-3 w-full border border-[#1E2A29] text-[#CDE7D8] rounded-md py-2 text-sm hover:border-[#0CF29D]/50 transition">Sign up with Google</button>
        <div className="mt-4 text-xs text-[#9BCDBA]">
          Already have an account? <Link className="text-[#0CF29D]" href="/signin">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

