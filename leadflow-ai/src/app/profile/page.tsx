"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { getFirebaseClientDb } from "@/lib/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Profile = {
  displayName?: string;
  company?: string;
  role?: string;
  bio?: string;
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    async function load() {
      if (!user) return;
      const db = getFirebaseClientDb();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.data() as any;
      setProfile({
        displayName: data?.displayName || user.displayName || "",
        company: data?.company || "",
        role: data?.role || "",
        bio: data?.bio || "",
      });
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#0CF29D] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    try {
      const db = getFirebaseClientDb();
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="text-lg font-semibold mb-4">Your Profile</div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="space-y-3">
            <input value={profile.displayName || ""} onChange={(e)=>setProfile({ ...profile, displayName: e.target.value })} placeholder="Display name" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
            <input value={profile.company || ""} onChange={(e)=>setProfile({ ...profile, company: e.target.value })} placeholder="Company" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
            <input value={profile.role || ""} onChange={(e)=>setProfile({ ...profile, role: e.target.value })} placeholder="Role" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
            <textarea value={profile.bio || ""} onChange={(e)=>setProfile({ ...profile, bio: e.target.value })} placeholder="Short bio" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm min-h-[96px]" />
            <button onClick={save} disabled={saving} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Preview</div>
          <div className="space-y-2 text-sm text-[#CDE7D8]">
            <div><span className="text-[#9BCDBA]">Name:</span> {profile.displayName || "-"}</div>
            <div><span className="text-[#9BCDBA]">Company:</span> {profile.company || "-"}</div>
            <div><span className="text-[#9BCDBA]">Role:</span> {profile.role || "-"}</div>
            <div><span className="text-[#9BCDBA]">Bio:</span> {profile.bio || "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

