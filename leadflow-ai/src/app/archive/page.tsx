"use client";

import { useEffect, useState } from "react";

export default function ArchivePage() {
  const [runs, setRuns] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/archive?userId=dev-user").then((r) => r.json()).then((d) => setRuns(d.runs || []));
  }, []);
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Archive</div>
      <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl">
        {runs.length === 0 ? (
          <div className="p-5 text-sm text-[#9BCDBA]">No archived runs.</div>
        ) : (
          <div className="divide-y divide-[#1E2A29]">
            {runs.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[#CDE7D8] text-sm">{new Date(r.date._seconds ? r.date._seconds * 1000 : r.date).toLocaleString()}</div>
                  <div className="text-xs text-[#9BCDBA] mt-1">{r.keywords} • {r.locations}</div>
                </div>
                <div className="text-sm text-[#CDE7D8]">Leads: {r.leadCount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

