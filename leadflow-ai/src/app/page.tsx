"use client";

import { useMemo, useState } from "react";
import WorkflowPipeline from "@/components/WorkflowPipeline";
import type { Lead } from "@/types/lead";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "running" | "completed">("idle");
  const [keywords, setKeywords] = useState("");
  const [locations, setLocations] = useState("");
  const [limit, setLimit] = useState<number>(5);
  const [runResult, setRunResult] = useState<any>(null);
  const [runLeads, setRunLeads] = useState<Lead[] | null>(null);
  const [filterKey, setFilterKey] = useState<"all" | "website" | "public_registry">("all");
  const [runSignal, setRunSignal] = useState(0);
  const [keysStatus, setKeysStatus] = useState<any>(null);

  async function checkKeys() {
    const res = await fetch("/api/keys");
    setKeysStatus(await res.json());
  }

  async function startRun() {
    setStatus("running");
    setRunSignal((n) => n + 1);
    setRunLeads(null);
    setFilterKey("all");
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "dev-user", keywords, locations, limit }),
      });
      const json = await res.json();
      setRunResult(json);
      if (json?.leads) setRunLeads(json.leads);
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
          <input value={keywords} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setKeywords(e.target.value)} placeholder="Keywords (e.g., plumbers, cafes)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0CF29D] focus:shadow-[0_0_0_1px_#0CF29D80]" />
          <input value={locations} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLocations(e.target.value)} placeholder="Locations (e.g., Sydney, Melbourne)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#0CF29D] focus:shadow-[0_0_0_1px_#0CF29D80]" />
          <input type="number" value={limit} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setLimit(parseInt(e.target.value||"5", 10))} placeholder="Limit" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <div className="flex items-center gap-3 text-xs text-[#9BCDBA]">
            <div className={`h-2 w-2 rounded-full ${status==="running"?"bg-[#0CF29D] animate-pulse":"bg-[#1E2A29]"}`} />
            <div>{status === "idle" ? "Idle" : status === "running" ? "Running..." : "Completed"}</div>
          </div>
          <button onClick={startRun} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">Start Scraping & Analysis</button>
          <button onClick={checkKeys} className="w-full border border-[#1E2A29] text-[#CDE7D8] rounded-md py-2 text-sm hover:border-[#0CF29D]/50 transition">Check API Keys</button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <WorkflowPipeline
          runSignal={runSignal}
          canFilter={status === "completed"}
          onNodeFilter={(k) => setFilterKey(k)}
        />

        <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Generated Leads</div>
            <div className="flex items-center gap-2 text-xs text-[#9BCDBA]">
              <button onClick={() => setFilterKey("all")} className={`px-2 py-1 rounded border ${filterKey === "all" ? "border-[#0CF29D] text-white" : "border-[#1E2A29]"}`}>All</button>
              <button onClick={() => setFilterKey("website")} className={`px-2 py-1 rounded border ${filterKey === "website" ? "border-[#0CF29D] text-white" : "border-[#1E2A29]"}`}>Website</button>
              <button onClick={() => setFilterKey("public_registry")} className={`px-2 py-1 rounded border ${filterKey === "public_registry" ? "border-[#0CF29D] text-white" : "border-[#1E2A29]"}`}>ABR</button>
            </div>
          </div>
          <div className="space-y-2">
            {runResult?.leadCount ? (
              <div className="text-sm text-[#CDE7D8]">Run {runResult.runId}: {runResult.leadCount} leads</div>
            ) : (
              <div className="text-sm text-[#9BCDBA]">No leads yet. Start a run.</div>
            )}
            {runLeads && (
              <div className="mt-2 divide-y divide-[#1E2A29] border border-[#1E2A29] rounded-md">
                {runLeads
                  .filter((l) => {
                    if (filterKey === "all") return true;
                    return (l.sources || []).some((s) => (filterKey === "website" ? s.source === "website" : s.source === "public_registry"));
                  })
                  .map((l, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{l.name}</div>
                        <div className="text-xs text-[#9BCDBA]">{l.website || "No site"}</div>
                      </div>
                      <div className="text-xs">
                        <span className="px-2 py-1 rounded bg-[#121A1B] border border-[#1E2A29]">{l.email || "No email"}</span>
                      </div>
                    </div>
                  ))}
              </div>
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

