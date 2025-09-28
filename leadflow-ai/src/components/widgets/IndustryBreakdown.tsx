"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function IndustryBreakdown({ data }: { data: { industry: string; count: number }[] }) {
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Industry Breakdown</div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid stroke="#1E2A29" vertical={false} />
            <XAxis dataKey="industry" tick={{ fill: "#9BCDBA", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9BCDBA", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#0F1517", border: "1px solid #1E2A29", color: "#CDE7D8" }} />
            <Bar dataKey="count" fill="#0CF29D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

