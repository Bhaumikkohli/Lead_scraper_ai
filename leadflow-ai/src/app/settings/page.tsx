"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [keys, setKeys] = useState<any>(null);
  useEffect(() => {
    fetch("/api/keys").then((r) => r.json()).then(setKeys);
  }, []);
  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">Settings</div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">API Keys Status</div>
          <div className="space-y-2 text-sm">
            {keys ? (
              <ul className="space-y-1">
                <li>Firebase Client: <span className={keys.firebaseClientReady?"text-[#0CF29D]":"text-red-400"}>{keys.firebaseClientReady?"OK":"Missing"}</span></li>
                <li>Firebase Admin: <span className={keys.firebaseAdminReady?"text-[#0CF29D]":"text-red-400"}>{keys.firebaseAdminReady?"OK":"Missing"}</span></li>
                <li>Gemini: <span className={keys.geminiReady?"text-[#0CF29D]":"text-red-400"}>{keys.geminiReady?"OK":"Missing"}</span></li>
                <li>SerpAPI: <span className={keys.serpapiReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.serpapiReady?"OK":"Optional"}</span></li>
                <li>ABR GUID: <span className={keys.abrReady?"text-[#0CF29D]":"text-yellow-400"}>{keys.abrReady?"OK":"Optional"}</span></li>
              </ul>
            ) : (
              <div className="text-[#9BCDBA]">Loading…</div>
            )}
          </div>
        </div>
        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">How to Configure</div>
          <ol className="list-decimal list-inside text-sm text-[#CDE7D8] space-y-1">
            <li>Copy .env.example to .env.local and fill values.</li>
            <li>Add Google Gemini API key.</li>
            <li>Provide Firebase Admin service account (project ID, client email, private key).</li>
            <li>Optionally add SerpAPI and ABR GUID for richer searches.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

