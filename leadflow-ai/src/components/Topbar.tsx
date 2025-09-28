"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, MoonStar } from "lucide-react";
import { APP_NAME } from "@/lib/env";
import useSWR from "swr";

export function Topbar() {
  const { theme, toggle } = useTheme();
  const { data } = useSWR("/api/n8n/health", (u)=>fetch(u).then(r=>r.json()), { refreshInterval: 30000 });
  return (
    <header className="h-16 border-b border-[#1E2A29]/60 flex items-center justify-between px-6 bg-[#0B0F10]/60 backdrop-blur">
      <div className="text-lg font-semibold tracking-wide">{APP_NAME()}</div>
      <div className="flex items-center gap-3 text-sm text-[#9BCDBA]">
        <div className={`px-2 py-1 rounded-md border text-xs ${data?.configured ? (data?.ok ? "border-emerald-500 text-emerald-400" : "border-amber-500 text-amber-400") : "border-[#1E2A29] text-[#9BCDBA]"}`}>
          n8n {data?.configured ? (data?.ok ? "healthy" : "unreachable") : "not configured"}
        </div>
        <span className="hidden md:block">{new Date().toLocaleString()}</span>
        <button onClick={toggle} className="h-9 w-9 grid place-items-center rounded-md hover:bg-white/5" aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <MoonStar size={16} />}
        </button>
      </div>
    </header>
  );
}

