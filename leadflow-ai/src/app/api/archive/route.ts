import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { SERVER_ENV } from "@/lib/env";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "dev-user";

  const env = SERVER_ENV();
  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    return NextResponse.json({ runs: [] });
  }
  try {
    const db = getAdminDb();
    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("archive")
      .orderBy("date", "desc")
      .limit(50)
      .get();
    const runs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ runs });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 400 });
  }
}

