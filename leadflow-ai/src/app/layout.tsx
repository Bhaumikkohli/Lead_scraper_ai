import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LeadFlow AI",
  description: "AI Lead Generation Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} antialiased h-full bg-[#0B0F10] text-[#E8F5E9]`}
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 0% 0%, rgba(0,255,153,0.08), transparent 60%), radial-gradient(800px 400px at 100% 100%, rgba(0,255,153,0.06), transparent 60%)",
        }}
      >
        <div className="min-h-screen grid grid-cols-[260px_1fr] relative">
          <div className="pointer-events-none absolute inset-0 opacity-40" style={{ maskImage: "radial-gradient(75% 55% at 50% 0%, black 60%, transparent 100%)" }}>
            <div className="absolute top-14 left-[260px] right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0CF29D40] to-transparent" />
          </div>
          <aside className="bg-[#0D1113] border-r border-[#1E2A29]/60">
            <div className="h-16 flex items-center px-5 border-b border-[#1E2A29]/60">
              <div className="h-8 w-8 rounded-md bg-[#0CF29D]/20 border border-[#0CF29D]/30 mr-3" />
              <div className="font-semibold tracking-wide">LeadFlow AI</div>
            </div>
            <nav className="p-3 space-y-1">
              <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/">
                <span>Dashboard</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/archive">
                <span>Archive</span>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[#CDE7D8] hover:bg-[#0CF29D]/10 hover:text-white transition-colors" href="/settings">
                <span>Settings</span>
              </a>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#1E2A29]/60">
              <div className="text-xs text-[#9BCDBA]">Signed in</div>
              <button className="mt-2 w-full text-left px-3 py-2 rounded-md bg-[#121A1B] border border-[#1E2A29] hover:border-[#0CF29D]/40 hover:shadow-[0_0_0_1px_#0CF29D80,0_0_20px_#0CF29D20] transition-all text-sm">Sign Out</button>
            </div>
          </aside>
          <main className="relative">
            <header className="h-16 border-b border-[#1E2A29]/60 flex items-center justify-between px-6 bg-[#0B0F10]/60 backdrop-blur">
              <div className="text-lg font-semibold tracking-wide">Dashboard</div>
              <div className="text-sm text-[#9BCDBA]">{new Date().toLocaleString()}</div>
            </header>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
