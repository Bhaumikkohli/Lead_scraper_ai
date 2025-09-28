"use client";

import { useEffect, useMemo, useState } from "react";

type NodeKey =
  | "serp"
  | "fetchHtml"
  | "extractEmails"
  | "abrMatch"
  | "abrDetails"
  | "validateAbr"
  | "assemble";

type NodeStatus = "idle" | "running" | "done" | "error";

export type WorkflowPipelineProps = {
  runSignal: number;
  canFilter: boolean;
  onNodeFilter: (filterKey: "website" | "public_registry" | "all") => void;
};

const NODE_META: Record<Exclude<NodeKey, "assemble">, { label: string; filterKey: "website" | "public_registry" }> = {
  serp: { label: "SERP Search", filterKey: "website" },
  fetchHtml: { label: "Fetch Website", filterKey: "website" },
  extractEmails: { label: "Extract Emails", filterKey: "website" },
  abrMatch: { label: "ABR Match", filterKey: "public_registry" },
  abrDetails: { label: "ABR Details", filterKey: "public_registry" },
  validateAbr: { label: "Validate ABR", filterKey: "public_registry" },
};

export default function WorkflowPipeline({ runSignal, canFilter, onNodeFilter }: WorkflowPipelineProps) {
  const [status, setStatus] = useState<Record<NodeKey, NodeStatus>>({
    serp: "idle",
    fetchHtml: "idle",
    extractEmails: "idle",
    abrMatch: "idle",
    abrDetails: "idle",
    validateAbr: "idle",
    assemble: "idle",
  });

  // Start a 1-second stepped animation for two parallel branches whenever runSignal changes
  useEffect(() => {
    // reset
    setStatus({
      serp: "idle",
      fetchHtml: "idle",
      extractEmails: "idle",
      abrMatch: "idle",
      abrDetails: "idle",
      validateAbr: "idle",
      assemble: "idle",
    });

    let cancelled = false;
    const timeouts: number[] = [];

    function later(ms: number, fn: () => void) {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id as unknown as number);
    }

    // t0: start both first nodes
    later(0, () => setStatus((s) => ({ ...s, serp: "running", abrMatch: "running" })));
    // t1: advance to next parallel nodes
    later(1000, () =>
      setStatus((s) => ({ ...s, serp: "done", fetchHtml: "running", abrMatch: "done", abrDetails: "running" }))
    );
    // t2
    later(2000, () =>
      setStatus((s) => ({ ...s, fetchHtml: "done", extractEmails: "running", abrDetails: "done", validateAbr: "running" }))
    );
    // t3: mark both branches done
    later(3000, () => setStatus((s) => ({ ...s, extractEmails: "done", validateAbr: "done", assemble: "running" })));
    // t4: final assemble
    later(4000, () => setStatus((s) => ({ ...s, assemble: "done" })));

    return () => {
      cancelled = true;
      for (const id of timeouts) window.clearTimeout(id);
    };
  }, [runSignal]);

  const renderNode = (key: Exclude<NodeKey, "assemble"> | "assemble") => {
    const st = status[key];
    const meta = NODE_META[key as keyof typeof NODE_META];
    const isClickable = canFilter && key !== "assemble";
    const hue = key === "assemble" ? "from-[#0CF29D] to-[#00C776]" : meta?.filterKey === "website" ? "from-[#00E7F2] to-[#00B8C7]" : "from-[#F2A20C] to-[#C77E00]";
    return (
      <button
        key={key}
        disabled={!isClickable}
        onClick={() => meta && onNodeFilter(meta.filterKey)}
        className={`group relative px-3 py-2 rounded-md border text-xs transition-all ${
          st === "running"
            ? "border-[#0CF29D] shadow-[0_0_0_1px_#0CF29D50,0_0_20px_#0CF29D20]"
            : st === "done"
            ? "border-[#1E2A29]"
            : "border-[#1E2A29]/60"
        } ${isClickable ? "hover:border-[#0CF29D]/50" : "opacity-80"}`}>
        <div className={`h-1 w-full rounded bg-gradient-to-r ${hue} ${st === "running" ? "animate-pulse" : st === "done" ? "opacity-80" : "opacity-20"}`} />
        <div className="mt-2 flex items-center gap-2 text-[#CDE7D8]">
          <span
            className={`h-2 w-2 rounded-full ${
              st === "running" ? "bg-[#0CF29D] animate-pulse" : st === "done" ? "bg-[#0CF29D]" : "bg-[#1E2A29]"
            }`}
          />
          <span>{key === "assemble" ? "Assemble & Respond" : meta?.label}</span>
        </div>
        {isClickable && <div className="absolute -bottom-5 left-0 text-[10px] text-[#9BCDBA] opacity-0 group-hover:opacity-100 transition">Filter results</div>}
      </button>
    );
  };

  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Workflow</div>
      <div className="space-y-6">
        <div>
          <div className="text-xs text-[#9BCDBA] mb-2">Website Branch</div>
          <div className="flex items-center gap-3 flex-wrap">
            {renderNode("serp")}
            <div className="h-px w-6 bg-[#1E2A29]" />
            {renderNode("fetchHtml")}
            <div className="h-px w-6 bg-[#1E2A29]" />
            {renderNode("extractEmails")}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#9BCDBA] mb-2">ABR Branch</div>
          <div className="flex items-center gap-3 flex-wrap">
            {renderNode("abrMatch")}
            <div className="h-px w-6 bg-[#1E2A29]" />
            {renderNode("abrDetails")}
            <div className="h-px w-6 bg-[#1E2A29]" />
            {renderNode("validateAbr")}
          </div>
        </div>
        <div>
          <div className="text-xs text-[#9BCDBA] mb-2">Output</div>
          {renderNode("assemble")}
        </div>
      </div>
    </div>
  );
}

