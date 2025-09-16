"use client";

import GlassCard from "@/components/ui/GlassCard";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [keys, setKeys] = useState<any>(null);
  useEffect(() => {
    fetch("/api/keys").then((r) => r.json()).then(setKeys).catch(() => {});
  }, []);
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold tracking-wide">Settings</div>
      <GlassCard className="p-4">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">API Keys</div>
        {keys ? (
          <div className="space-y-2 text-sm">
            <div>Firebase Client: <span className={keys.firebaseClientReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.firebaseClientReady?"OK":"Missing"}</span></div>
            <div>Firebase Admin: <span className={keys.firebaseAdminReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.firebaseAdminReady?"OK":"Missing"}</span></div>
            <div>Gemini: <span className={keys.geminiReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.geminiReady?"OK":"Missing"}</span></div>
            <div>SERPAPI: <span className={keys.serpapiReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.serpapiReady?"OK":"Missing"}</span></div>
            <div>ABR GUID: <span className={keys.abrReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.abrReady?"OK":"Missing"}</span></div>
            {!keys.firebaseAdminReady && (
              <div className="text-xs text-[#9BCDBA]">Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env.local</div>
            )}
          </div>
        ) : (
          <div className="text-sm text-[#9BCDBA]">Loading...</div>
        )}
      </GlassCard>
    </div>
  );
}
