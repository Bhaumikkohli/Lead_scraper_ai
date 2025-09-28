"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, LayoutGrid, List, Settings, Rocket } from "lucide-react";

export function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`relative border-r border-[#1E2A29]/60 bg-[#0D1113] ${open ? "w-[260px]" : "w-[72px]"} transition-all`}> 
      <div className="h-16 flex items-center px-3 border-b border-[#1E2A29]/60">
        <button aria-label="Toggle sidebar" className="h-9 w-9 grid place-items-center rounded-md hover:bg-white/5" onClick={() => setOpen((v) => !v)}>
          <Menu size={18} />
        </button>
        {open && (
          <div className="ml-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-[#0CF29D]/20 border border-[#0CF29D]/30" />
            <div className="font-semibold tracking-wide">LeadFlow AI</div>
          </div>
        )}
      </div>
      <nav className="p-3 space-y-1">
        <Link className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/">
          <LayoutGrid size={16} />
          {open && <span>Dashboard</span>}
        </Link>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/lists">
          <List size={16} />
          {open && <span>Lead Lists</span>}
        </Link>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/jobs">
          <Rocket size={16} />
          {open && <span>Scraping Jobs</span>}
        </Link>
        <Link className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/settings">
          <Settings size={16} />
          {open && <span>Settings</span>}
        </Link>
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#1E2A29]/60">
        <div className="text-xs text-[#9BCDBA]">Signed in</div>
        {open && <button className="mt-2 w-full text-left px-3 py-2 rounded-md bg-[#121A1B] border border-[#1E2A29] hover:border-[#0CF29D]/40 hover:shadow-[0_0_0_1px_#0CF29D80,0_0_20px_#0CF29D20] transition-all text-sm">Sign Out</button>}
      </div>
    </aside>
  );
}

