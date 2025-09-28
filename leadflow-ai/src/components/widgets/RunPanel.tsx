"use client";

import { useEffect, useMemo, useState } from "react";
import { WorkflowPipeline, PipelineEvent, PipelineStepKey } from "@/components/WorkflowPipeline";
import { authFetch } from "@/lib/authFetch";

type LeadRow = {
  name: string;
  website?: string;
  email?: string;
  sources?: { source: string; method: string; details?: string; createdAt: string }[];
};

export function RunPanel() {
  const [keywords, setKeywords] = useState("");
  const [locations, setLocations] = useState("");
  const [limit, setLimit] = useState(5);
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [selectedStep, setSelectedStep] = useState<PipelineStepKey | null>(null);

  function pushEvent(step: PipelineStepKey, detail: string) {
    setEvents((e) => [...e, { step, detail, at: new Date().toISOString() }]);
  }

  async function startRun() {
    setRunning(true);
    setEvents([]);
    setLeads([]);
    try {
      pushEvent("prospectDiscovery", `Searching prospects for "${keywords}" in ${locations}`);
      await new Promise((r) => setTimeout(r, 1000));
      pushEvent("websiteScrape", "Scraping websites for contact info");
      await new Promise((r) => setTimeout(r, 1000));
      pushEvent("publicRegistry", "Checking ABN/ASIC registries");
      await new Promise((r) => setTimeout(r, 1000));
      pushEvent("professionalNetwork", "Searching LinkedIn for decision-makers");
      await new Promise((r) => setTimeout(r, 1000));
      pushEvent("aiQualification", "Scoring and qualifying leads with AI");

      const res = await authFetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "self", keywords, locations, limit }),
      });
      const json = await res.json();

      pushEvent("campaignQueue", `Prepared ${json?.leadCount ?? 0} leads for campaigns`);
      setLeads((json?.leads || []).slice(0, 100));
    } catch (e: any) {
      pushEvent("aiQualification", e?.message ?? "Run failed");
    } finally {
      setRunning(false);
    }
  }

  const filteredLeads = useMemo(() => {
    if (!selectedStep) return leads;
    const sourceMap: Record<PipelineStepKey, string> = {
      prospectDiscovery: "ai_initial",
      websiteScrape: "website",
      publicRegistry: "public_registry",
      professionalNetwork: "professional_network",
      aiQualification: "ai_initial",
      campaignQueue: "ai_initial",
    };
    const tag = sourceMap[selectedStep];
    return leads.filter((l) => (l.sources || []).some((s) => s.source === tag));
  }, [leads, selectedStep]);

  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Run Workflow</div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <input value={keywords} onChange={(e)=>setKeywords(e.target.value)} placeholder="Keywords (e.g., plumbers, cafes)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <input value={locations} onChange={(e)=>setLocations(e.target.value)} placeholder="Locations (e.g., Sydney, Melbourne)" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <input type="number" value={limit} onChange={(e)=>setLimit(parseInt(e.target.value||"5"))} placeholder="Limit" className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" />
          <button onClick={startRun} disabled={running} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition">{running?"Running...":"Start Run"}</button>
        </div>
        <div>
          <WorkflowPipeline running={running} events={events} onSelectStep={setSelectedStep} />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-2">Results {selectedStep && <span className="text-[#0CF29D]">(filtered)</span>}</div>
        <div className="space-y-2 max-h-72 overflow-auto">
          {filteredLeads.length === 0 ? (
            <div className="text-sm text-[#9BCDBA]">No results yet</div>
          ) : (
            filteredLeads.map((l, idx) => (
              <div key={`${l.name}-${idx}`} className="p-3 rounded-md bg-[#0B1012] border border-[#1E2A29]">
                <div className="text-sm text-white">{l.name}</div>
                <div className="text-xs text-[#9BCDBA]">
                  {l.website && <span className="mr-3">{l.website}</span>}
                  {l.email && <span>{l.email}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

