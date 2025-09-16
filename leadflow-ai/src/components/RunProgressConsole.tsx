"use client";

import { useEffect, useRef, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

type Props = { userId: string; keywords: string; locations: string; limit: number; onComplete?: (data: any)=>void };

export default function RunProgressConsole({ userId, keywords, locations, limit, onComplete }: Props) {
  const [lines, setLines] = useState<{ step: string; message: string; state?: string }[]>([]);
  const [state, setState] = useState<Record<string, "idle" | "start" | "done">>({
    ai_initial: "idle",
    website: "idle",
    public_registry: "idle",
    linkedin: "idle",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `/api/run/stream?` + new URLSearchParams({ userId, keywords, locations, limit: String(limit) }).toString();
    const evt = new EventSource(url);
    const addLine = (step: string, message: string, s?: string) => {
      setLines((prev) => [...prev, { step, message, state: s as any }]);
      setTimeout(() => { containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" }); }, 0);
    };
    evt.addEventListener("status", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        if (data.step && data.state) setState((prev) => ({ ...prev, [data.step]: data.state }));
        addLine(data.step || "status", data.message || "");
      } catch {}
    });
    evt.addEventListener("completed", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        addLine("completed", `Run ${data.runId} with ${data.leadCount} leads`);
        onComplete?.(data);
      } catch {}
      evt.close();
    });
    evt.addEventListener("error", (e: MessageEvent) => {
      try { const data = JSON.parse(e.data); addLine("error", data.message); } catch {}
      evt.close();
    });
    return () => evt.close();
  }, [userId, keywords, locations, limit, onComplete]);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <GlassCard className="p-4">
        <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Live Progress</div>
        <div ref={containerRef} className="h-56 overflow-auto space-y-2 bg-[#0B1012] border border-[#1E2A29] rounded-md p-3 text-xs text-[#CDE7D8]">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap">
              <span className="text-[#9BCDBA]">[{l.step}]</span> {l.message}
            </div>
          ))}
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-4">
        {["ai_initial","website","public_registry","linkedin"].map((s) => (
          <GlassCard key={s} className={`p-4 transition-shadow ${state[s as keyof typeof state]==="start"?"shadow-[0_0_0_1px_#0CF29D80,0_0_30px_#0CF29D40]":""}`}>
            <div className="text-sm font-medium capitalize">{s.replace("_"," ")}</div>
            <div className="text-xs mt-1 text-[#9BCDBA]">{state[s as keyof typeof state] || "idle"}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

