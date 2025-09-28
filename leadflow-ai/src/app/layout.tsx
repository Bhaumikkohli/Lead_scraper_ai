import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

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
      <body className={`${inter.variable} antialiased h-full`}
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 0% 0%, rgba(0,255,153,0.08), transparent 60%), radial-gradient(800px 400px at 100% 100%, rgba(0,255,153,0.06), transparent 60%)",
        }}
      >
        <ThemeProvider>
          <div className="min-h-screen grid grid-cols-[auto_1fr]">
            <Sidebar />
            <main className="relative">
              <Topbar />
              <div className="p-6">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

