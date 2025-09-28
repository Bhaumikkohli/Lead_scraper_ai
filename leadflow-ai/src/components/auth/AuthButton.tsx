'use client';

import { useAuth } from './AuthProvider';
import { Loader2, LogIn, LogOut, User2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthButton() {
  const { user, signingIn, signInWithGoogle, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors">
          <User2 size={16} />
          <span>{user.displayName || user.email}</span>
        </Link>
        <button onClick={signOut} className="px-3 py-2 rounded-md bg-[#121A1B] border border-[#1E2A29] hover:border-[#0CF29D]/40 hover:shadow-[0_0_0_1px_#0CF29D80,0_0_20px_#0CF29D20] transition-all text-sm flex items-center gap-2">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      disabled={signingIn}
      className="w-full text-left px-3 py-2 rounded-md bg-[#121A1B] border border-[#1E2A29] hover:border-[#0CF29D]/40 hover:shadow-[0_0_0_1px_#0CF29D80,0_0_20px_#0CF29D20] transition-all text-sm flex items-center gap-2 justify-center"
    >
      {signingIn ? (
        <>
          <Loader2 className="animate-spin" size={16} />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <LogIn size={16} />
          <span>Sign in with Google</span>
        </>
      )}
    </button>
  );
}

