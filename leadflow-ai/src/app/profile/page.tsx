"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";

type Theme = "light" | "dark" | "system";

type UserProfile = {
  displayName: string | null;
  photoURL: string | null;
  role?: string;
  preferences?: {
    theme?: Theme;
    accentColor?: string;
  };
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const db = useMemo(() => getFirebaseClientDb(), []);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile({
          displayName: data.displayName ?? user.displayName ?? null,
          photoURL: data.photoURL ?? user.photoURL ?? null,
          role: data.role ?? "user",
          preferences: {
            theme: data.preferences?.theme ?? "system",
            accentColor: data.preferences?.accentColor ?? "#0CF29D",
          },
        });
      } else {
        const initial: UserProfile = {
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
          role: "user",
          preferences: { theme: "system", accentColor: "#0CF29D" },
        };
        await setDoc(ref, initial);
        setProfile(initial);
      }
    }
    load();
  }, [user, db]);

  async function save() {
    if (!user || !profile) return;
    setSaving(true);
    setSavedOk(false);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        preferences: profile.preferences,
      });
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#9BCDBA]">
        <Loader2 className="animate-spin" size={16} />
        <span>Loading session...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
        <div className="text-sm text-[#CDE7D8]">Please sign in to view your profile.</div>
        <Link href="/" className="inline-block mt-3 text-xs text-[#0CF29D] underline">Go back</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#9BCDBA]">
        <Loader2 className="animate-spin" size={16} />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Profile</div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#0CF29D]/10 border border-[#0CF29D]/30 overflow-hidden">
            {profile.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoURL} alt="avatar" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={profile.displayName ?? ''}
              onChange={(e)=>setProfile((prev: UserProfile | null)=>prev?{...prev,displayName:e.target.value}:prev)}
              placeholder="Display name"
              className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0CF29D] focus:shadow-[0_0_0_1px_#0CF29D80]"
            />
            <input
              value={profile.photoURL ?? ''}
              onChange={(e)=>setProfile((prev: UserProfile | null)=>prev?{...prev,photoURL:e.target.value}:prev)}
              placeholder="Photo URL"
              className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Preferences</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={profile.preferences?.theme ?? 'system'}
            onChange={(e)=>setProfile((prev: UserProfile | null)=>prev?{...prev,preferences:{...(prev.preferences ?? {}), theme: e.target.value as Theme}}:prev)}
            className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <input
            type="color"
            value={profile.preferences?.accentColor ?? '#0CF29D'}
            onChange={(e)=>setProfile((prev: UserProfile | null)=>prev?{...prev,preferences:{...(prev.preferences ?? {}), accentColor:e.target.value}}:prev)}
            className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm h-10"
          />
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition flex items-center justify-center gap-2 disabled:bg-[#1E2A29] disabled:text-[#9BCDBA]"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
        {savedOk && <div className="mt-2 text-xs text-[#9BCDBA]">Saved!</div>}
      </div>
    </div>
  );
}

