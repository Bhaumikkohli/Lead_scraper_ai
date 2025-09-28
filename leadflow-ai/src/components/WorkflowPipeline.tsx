"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PipelineStepKey =
  | "prospectDiscovery"
  | "websiteScrape"
  | "publicRegistry"
  | "professionalNetwork"
  | "aiQualification"
  | "campaignQueue";

export type PipelineStep = {
  key: PipelineStepKey;
  label: string;
  description?: string;
};

export type PipelineEvent = {
  step: PipelineStepKey;
  detail: string;
  at: string; // ISO timestamp
};

type Props = {
  running: boolean;
  onSelectStep?: (step: PipelineStepKey) => void;
  events?: PipelineEvent[];
};

const defaultSteps: PipelineStep[] = [
  { key: "prospectDiscovery", label: "Prospects" },
  { key: "websiteScrape", label: "Website" },
  { key: "publicRegistry", label: "Registry" },
  { key: "professionalNetwork", label: "Network" },
  { key: "aiQualification", label: "AI Qualify" },
  { key: "campaignQueue", label: "Campaign" },
];

export function WorkflowPipeline({ running, onSelectStep, events = [] }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = defaultSteps;

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % steps.length);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, steps.length]);

  const grouped = useMemo(() => {
    const g: Record<PipelineStepKey, PipelineEvent[]> = {
      prospectDiscovery: [],
      websiteScrape: [],
      publicRegistry: [],
      professionalNetwork: [],
      aiQualification: [],
      campaignQueue: [],
    };
    for (const ev of events) g[ev.step].push(ev);
    return g;
  }, [events]);

  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-4">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Workflow</div>
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {steps.map((s, idx) => {
          const isActive = idx === activeIdx && running;
          return (
            <button
              key={s.key}
              onClick={() => onSelectStep?.(s.key)}
              className={`relative px-3 py-2 rounded-md border text-xs whitespace-nowrap ${
                isActive ? "border-[#0CF29D] text-white bg-[#0CF29D]/10" : "border-[#1E2A29] text-[#CDE7D8] bg-[#0B1012]"
              }`}
            >
              <div className="flex items-center gap-2">
                {isActive && <span className="h-2 w-2 rounded-full bg-[#0CF29D] animate-pulse" />}
                <span>{s.label}</span>
                <span className="text-[#9BCDBA]">({grouped[s.key]?.length || 0})</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-3 h-32 overflow-auto bg-[#0B1012] border border-[#1E2A29] rounded-md p-3">
        <AnimatePresence initial={false}>
          {(events || []).slice(-50).map((ev) => (
            <motion.div
              key={`${ev.step}-${ev.at}-${ev.detail}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-[#CDE7D8] flex items-center gap-2 py-0.5"
            >
              <span className="text-[#9BCDBA]">[{new Date(ev.at).toLocaleTimeString()}]</span>
              <span className="text-[#0CF29D]">{steps.find((s) => s.key === ev.step)?.label}:</span>
              <span>{ev.detail}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

