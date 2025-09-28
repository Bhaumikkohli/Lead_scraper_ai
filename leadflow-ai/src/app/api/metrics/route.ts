import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { KPIResponse } from "@/types/dashboard";

export async function GET(req: NextRequest) {
  try {
    // Verify auth token, derive userId
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const userId = decoded.uid;
    // For demo/dev, aggregate basic metrics from Firestore
    // In production, these would be precomputed or queried efficiently
    const db = getAdminDb();
    const runsSnap = await db
      .collection("users")
      .doc(userId)
      .collection("archive")
      .get();

    let totalLeads = 0;
    let newLeads24h = 0;
    let newLeads7d = 0;
    let newLeads30d = 0;

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    for (const doc of runsSnap.docs) {
      const data = doc.data() as any;
      const created = (data.date?.toDate?.() ?? data.date ?? new Date()).valueOf();
      const leads = Array.isArray(data.leads) ? data.leads : [];
      totalLeads += leads.length;
      if (now - created <= dayMs) newLeads24h += leads.length;
      if (now - created <= 7 * dayMs) newLeads7d += leads.length;
      if (now - created <= 30 * dayMs) newLeads30d += leads.length;
    }

    const payload: KPIResponse = {
      totalLeads,
      newLeads24h,
      newLeads7d,
      newLeads30d,
      successfulJobs: runsSnap.size, // treat all as successful for now
      failedJobs: 0,
      activeCampaigns: 0, // placeholder until campaigns implemented
      lastUpdated: new Date().toISOString(),
    };
    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to fetch metrics" }, { status: 500 });
  }
}

