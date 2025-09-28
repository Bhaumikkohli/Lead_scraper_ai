import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SERVER_ENV } from "@/lib/env";
import { getAdminDb } from "@/lib/firebase/admin";
import { Lead } from "@/types/lead";

const bodySchema = z.object({
  userId: z.string().min(1),
  keywords: z.string().min(1),
  locations: z.string().min(1),
  limit: z.number().int().positive().max(50).default(5),
});

// Removed unused Gemini types after switching to n8n pipeline

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { userId, keywords, locations, limit } = bodySchema.parse(json);

    const serverEnv = SERVER_ENV();
    const webhookUrl = serverEnv.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("N8N_WEBHOOK_URL is not configured");
    }

    // Trigger n8n parallel workflow
    const wfResp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keywords, locations, limit }),
    });
    if (!wfResp.ok) {
      const text = await wfResp.text();
      throw new Error(`n8n webhook failed: ${wfResp.status} ${text}`);
    }
    const wfData = (await wfResp.json()) as any;

    // Expect single or array of results
    const results = Array.isArray(wfData) ? wfData : [wfData];
    const leads: Lead[] = results.map((r: any) => ({
      name: r.result?.name,
      website: r.result?.website,
      email: r.result?.email,
      status: "new",
      contacts: [],
      sources: [
        { source: "website", method: "serpapi", details: r.result?.website, createdAt: nowIso() },
        { source: "public_registry", method: "abr", details: r.result?.abr?.Abn || "", createdAt: nowIso() },
      ],
    }));

    // Persist to Firestore under user archive
    const db = getAdminDb();
    const runRef = db
      .collection("users")
      .doc(userId)
      .collection("archive")
      .doc();
    const runDoc = {
      date: new Date(),
      keywords,
      locations,
      leadCount: leads.length,
      leads,
    };
    await runRef.set(runDoc as any);

    const keyHints = {
      geminiConfigured: Boolean(serverEnv.GOOGLE_GEMINI_API_KEY),
      serpapiConfigured: Boolean(serverEnv.SERPAPI_API_KEY),
      abrConfigured: Boolean(serverEnv.ABR_GUID),
      n8nConfigured: Boolean(serverEnv.N8N_WEBHOOK_URL),
    };

    return NextResponse.json({ runId: runRef.id, leadCount: leads.length, keyHints });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 400 });
  }
}


