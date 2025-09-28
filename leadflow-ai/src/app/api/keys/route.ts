import { NextRequest, NextResponse } from "next/server";
import { getKeyStatus } from "@/lib/env";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    if (!decoded?.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const status = getKeyStatus();
  return NextResponse.json(status);
}


