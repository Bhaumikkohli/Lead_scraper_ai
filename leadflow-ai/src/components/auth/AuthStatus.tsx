'use client';

import { useAuth } from './AuthProvider';

export default function AuthStatus() {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="text-xs text-[#9BCDBA] animate-pulse">Checking session...</div>;
  }
  if (user) {
    return (
      <div className="text-xs text-[#9BCDBA]">
        Signed in as <span className="text-[#CDE7D8]">{user.displayName || user.email}</span>
      </div>
    );
  }
  return <div className="text-xs text-[#9BCDBA]">Not signed in</div>;
}

