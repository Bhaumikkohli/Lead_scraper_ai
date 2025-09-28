import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const db = getAdminDb();
    const userId = decoded.uid;

    const runsSnap = await db.collection("users").doc(userId).collection("archive").orderBy("date", "desc").limit(3).get();
    const lastRun = runsSnap.docs[0]?.data() as any;
    const lastLeads = Array.isArray(lastRun?.leads) ? lastRun.leads.length : 0;

    const recommendations = [
      lastLeads > 0
        ? {
            id: "start-campaign",
            text: `You have ${lastLeads} new leads from the last run. Start a new campaign?`,
            action: { label: "Create Campaign", href: "/campaigns/new" },
          }
        : {
            id: "run-scrape",
            text: "No recent leads detected. Run a new scraping job?",
            action: { label: "New Scrape", href: "/" },
          },
      {
        id: "improve-open-rate",
        text: "Your 'Tech Startup' campaign has a low open rate. Try a different subject line.",
        action: { label: "View Campaigns", href: "/campaigns" },
      },
      {
        id: "explore-source",
        text: "You haven't scraped leads from LinkedIn recently. Start a new scraping job?",
        action: { label: "New LinkedIn Run", href: "/jobs/new?source=linkedin" },
      },
    ];

    return NextResponse.json({ recommendations });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to load recommendations" }, { status: 500 });
  }
}

