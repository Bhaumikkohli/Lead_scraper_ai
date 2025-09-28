import { NextRequest, NextResponse } from "next/server";
import { SERVER_ENV } from "@/lib/env";

export async function GET(_req: NextRequest) {
  const env = SERVER_ENV();
  const url = env.N8N_URL || env.N8N_WEBHOOK_URL;
  if (!url) return NextResponse.json({ ok: false, configured: false });
  try {
    const res = await fetch(url, { method: "HEAD" });
    return NextResponse.json({ ok: res.ok, status: res.status, configured: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, configured: true, error: e?.message }, { status: 200 });
  }
}

