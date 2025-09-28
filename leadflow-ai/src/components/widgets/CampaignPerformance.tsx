"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

export type CampaignPoint = {
  date: string;
  openRate: number;
  clickRate: number;
  replyRate: number;
  bounceRate: number;
};

export function CampaignPerformance({ data }: { data: CampaignPoint[] }) {
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Email Campaign Performance</div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
            <XAxis dataKey="date" tick={{ fill: "#9BCDBA", fontSize: 12 }} />
            <YAxis tick={{ fill: "#9BCDBA", fontSize: 12 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "#0F1517", border: "1px solid #1E2A29", color: "#CDE7D8" }} />
            <Legend wrapperStyle={{ color: "#9BCDBA" }} />
            <Line type="monotone" dataKey="openRate" name="Open%" stroke="#0CF29D" dot={false} />
            <Line type="monotone" dataKey="clickRate" name="Click%" stroke="#22D3EE" dot={false} />
            <Line type="monotone" dataKey="replyRate" name="Reply%" stroke="#A78BFA" dot={false} />
            <Line type="monotone" dataKey="bounceRate" name="Bounce%" stroke="#F59E0B" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

