"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [keywords, setKeywords] = useState("");
  const [locations, setLocations] = useState("");
  const [limit, setLimit] = useState(5);
  const [runResult, setRunResult] = useState<any>(null);
  const [keysStatus, setKeysStatus] = useState<any>(null);

  async function checkKeys() {
    const res = await fetch("/api/keys");
    setKeysStatus(await res.json());
  }

  async function startRun() {
    setStatus("running");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "dev-user", keywords, locations, limit }),
      });
      const json = await res.json();
      setRunResult(json);
      setStatus("completed");
    } catch (e) {
      setStatus("idle");
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5 shadow-[0_0_0_1px_#0CF29D20,0_0_30px_#0CF29D10]">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">New Lead Run</div>
        <div className="space-y-3">
          <input value={keywords} onChange={(e)=>setKeywords(e.target.value)} placeholder="Keywords (e.g., plumbers, cafes)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0CF29D] focus:shadow-[0_0_0_1px_#0CF29D80]" />
          <input value={locations} onChange={(e)=>setLocations(e.target.value)} placeholder="Locations (e.g., Sydney, Melbourne)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0CF29D] focus:shadow-[0_0_0_1px_#0CF29D80]" />
          <input type="number" value={limit} onChange={(e)=>setLimit(parseInt(e.target.value||"5"))} placeholder="Limit" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <div className="flex items-center gap-3 text-xs text-[#9BCDBA]">
            <div className={`h-2 w-2 rounded-full ${status==="running"?"bg-[#0CF29D] animate-pulse":"bg-[#1E2A29]"}`} />
            <div>{status === "idle" ? "Idle" : status === "running" ? "Running..." : "Completed"}</div>
          </div>
          <button onClick={startRun} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">Start Scraping & Analysis</button>
          <button onClick={checkKeys} className="w-full border border-[#1E2A29] text-[#CDE7D8] rounded-md py-2 text-sm hover:border-[#0CF29D]/50 transition">Check API Keys</button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Funnel Overview</div>
          <div className="space-y-3">
            {[
              { label: "Leads Found", value: status !== "idle" ? 60 : 0 },
              { label: "Analyzed", value: status === "completed" ? 40 : 0 },
              { label: "Email Generated", value: status === "completed" ? 20 : 0 },
              { label: "Email Sent", value: 0 },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs text-[#9BCDBA] mb-1"><span>{s.label}</span><span>{s.value}%</span></div>
                <div className="h-2 bg-[#0B1012] rounded">
                  <div className="h-2 rounded bg-gradient-to-r from-[#0CF29D] to-[#00C776]" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Generated Leads</div>
          <div className="space-y-2">
            {runResult?.leadCount ? (
              <div className="text-sm text-[#CDE7D8]">Run created with ID {runResult.runId}. Lead count: {runResult.leadCount}. Keys: {JSON.stringify(runResult.keyHints)}</div>
            ) : (
              <div className="text-sm text-[#9BCDBA]">No leads yet. Start a run.</div>
            )}
          </div>
        </div>

        {keysStatus && (
          <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
            <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">API Key Status</div>
            <pre className="text-xs text-[#CDE7D8] whitespace-pre-wrap">{JSON.stringify(keysStatus, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
