"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function ArchivePage() {
  const [runs, setRuns] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/archive").then((r) => r.json()).then((d) => setRuns(d.runs || [])).catch(() => {});
  }, []);
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold tracking-wide">Archive</div>
      <GlassCard className="p-4">
        <div className="space-y-3">
          {runs.length === 0 && <div className="text-sm text-[#9BCDBA]">No runs yet.</div>}
          {runs.map((run) => (
            <div key={run.id} className="p-3 bg-[#0B1012] border border-[#1E2A29] rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[#E8F5E9]">{new Date(run.date).toLocaleString()}</div>
                <div className="text-xs text-[#9BCDBA]">{run.leadCount} leads</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {run.keywords?.split(",").map((k: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-[#1E2A29] text-[#9BCDBA]">{k.trim()}</span>
                ))}
                {run.locations?.split(",").map((k: string, i: number) => (
                  <span key={i} className="px-2 py-1 rounded-full border border-[#1E2A29] text-[#9BCDBA]">{k.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
