"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0CF29D", "#00C776", "#22D3EE", "#A78BFA", "#F59E0B", "#F472B6"];

export function SourceBreakdown({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Lead Source Breakdown</div>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0F1517", border: "1px solid #1E2A29", color: "#CDE7D8" }} />
            <Legend wrapperStyle={{ color: "#9BCDBA" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

