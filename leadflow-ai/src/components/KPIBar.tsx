"use client";

import useSWR from "swr";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type KPIResponse = {
  totalLeads: number;
  newLeads24h: number;
  newLeads7d: number;
  newLeads30d: number;
  successfulJobs: number;
  failedJobs: number;
  activeCampaigns: number;
  lastUpdated: string;
};

function KPI({ label, value, trend }: { label: string; value: number | string; trend?: "up" | "down" }) {
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-4 flex-1 min-w-[180px]">
      <div className="text-xs uppercase tracking-widest text-[#9BCDBA] mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-semibold text-white">{value}</div>
        {trend && (
          <div className={`text-xs flex items-center gap-1 ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend === "up" ? "Up" : "Down"}
          </div>
        )}
      </div>
    </div>
  );
}

export function KPIBar() {
  const { data } = useSWR("/api/metrics", fetcher, { refreshInterval: 30_000 });
  const m: KPIResponse | undefined = data as KPIResponse | undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KPI label="Total Leads" value={m?.totalLeads ?? 0} trend={undefined} />
      <KPI label="New (24h)" value={m?.newLeads24h ?? 0} trend={m && m.newLeads24h >= 0 ? "up" : undefined} />
      <KPI label="New (7d)" value={m?.newLeads7d ?? 0} trend={m && m.newLeads7d >= 0 ? "up" : undefined} />
      <KPI label="Jobs ✓" value={m?.successfulJobs ?? 0} trend={undefined} />
      <KPI label="Jobs ✕" value={m?.failedJobs ?? 0} trend={m && m.failedJobs > 0 ? "down" : undefined} />
    </div>
  );
}

