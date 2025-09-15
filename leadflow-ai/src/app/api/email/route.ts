import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { to, subject, text } = body || {};
  if (!to || !subject || !text) {
    return NextResponse.json({ error: "Missing to/subject/text" }, { status: 400 });
  }
  // Placeholder: integrate with email provider (e.g., Resend, Sendgrid)
  return NextResponse.json({ ok: true });
}

