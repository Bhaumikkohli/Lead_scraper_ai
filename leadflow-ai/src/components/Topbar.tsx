"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, MoonStar } from "lucide-react";

export function Topbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="h-16 border-b border-[#1E2A29]/60 flex items-center justify-between px-6 bg-[#0B0F10]/60 backdrop-blur">
      <div className="text-lg font-semibold tracking-wide">Dashboard</div>
      <div className="flex items-center gap-3 text-sm text-[#9BCDBA]">
        <span className="hidden md:block">{new Date().toLocaleString()}</span>
        <button onClick={toggle} className="h-9 w-9 grid place-items-center rounded-md hover:bg-white/5" aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <MoonStar size={16} />}
        </button>
      </div>
    </header>
  );
}

