"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";

export default function KeyStatusBanner() {
  const [status, setStatus] = useState<any>(null);
  useEffect(() => {
    fetch("/api/keys").then((r) => r.json()).then(setStatus).catch(() => {});
  }, []);
  if (!status) return null;

  const allGood = status.firebaseClientReady && status.firebaseAdminReady && status.geminiReady;
  return (
    <GlassCard className="p-3 border-dashed">
      <div className="text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${allGood ? "bg-[#0CF29D]" : "bg-yellow-400"}`} />
          <span className="text-[#9BCDBA]">API Keys</span>
        </div>
        <div className="text-[#CDE7D8]">
          {allGood ? "All configured" : `Missing: ${status.missingKeys?.join(", ")}`}
        </div>
      </div>
    </GlassCard>
  );
}

