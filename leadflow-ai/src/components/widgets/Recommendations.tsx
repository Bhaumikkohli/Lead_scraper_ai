"use client";

import useSWR from "swr";
import { authFetch } from "@/lib/authFetch";

type Recommendation = { id: string; text: string; action?: { label: string; href?: string; onClick?: string } };

const fetcher = (url: string) => authFetch(url).then((r) => r.json());

export function Recommendations() {
  const { data } = useSWR("/api/recommendations", fetcher, { refreshInterval: 60_000 });
  const items: Recommendation[] = (data as { recommendations: Recommendation[] } | undefined)?.recommendations ?? [];
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">What to do next</div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-[#9BCDBA]">No recommendations yet</div>
        ) : (
          items.map((r: Recommendation) => (
            <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-md bg-[#0B1012] border border-[#1E2A29]">
              <div className="text-sm text-[#CDE7D8]">{r.text}</div>
              {r.action && (
                r.action.href ? (
                  <a href={r.action.href} className="text-xs px-3 py-1 rounded-md bg-[#0CF29D] text-black font-medium hover:brightness-95">{r.action.label}</a>
                ) : (
                  <button className="text-xs px-3 py-1 rounded-md bg-[#0CF29D] text-black font-medium hover:brightness-95">{r.action.label}</button>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

