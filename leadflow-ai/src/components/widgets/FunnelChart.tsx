"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export function FunnelChart({ stages }: { stages: { label: string; value: number }[] }) {
  const data = stages.map((s) => ({ name: s.label, value: s.value }));
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Lead Acquisition Funnel</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis dataKey="name" type="category" width={150} tick={{ fill: "#9BCDBA", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "#0B1012" }} contentStyle={{ background: "#0F1517", border: "1px solid #1E2A29", color: "#CDE7D8" }} />
            <Bar dataKey="value" fill="#0CF29D" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

