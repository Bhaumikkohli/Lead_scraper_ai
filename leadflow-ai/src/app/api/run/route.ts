import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/gemini";
import { getAdminDb, getAdminAuth } from "@/lib/firebase/admin";
import { Lead, ProvenanceEntry } from "@/types/lead";
import { SERVER_ENV } from "@/lib/env";

const bodySchema = z.object({
  userId: z.string().min(1),
  keywords: z.string().min(1),
  locations: z.string().min(1),
  limit: z.number().int().positive().max(50).default(5),
});

type GeminiInitialLead = {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
};

type GeminiInitialResponse = {
  leads: GeminiInitialLead[];
};

type WebsiteScrapeResponse = {
  email?: string;
  contacts?: { fullName: string; title?: string; email?: string }[];
};

type PublicRegistryResponse = {
  directors?: { fullName: string; role?: string }[];
};

type ProfessionalNetworkResponse = {
  decisionMakers?: { fullName: string; title: string }[];
};

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const decoded = await getAdminAuth().verifyIdToken(token);
    const json = await req.json();
    const { userId, keywords, locations, limit } = bodySchema.parse(json);
    const uid = decoded.uid || userId;

    // Step 1: Initial lead discovery via Gemini
    const prompt1 = `Find ${limit} real businesses in Australia related to "${keywords}" in cities like "${locations}". For each business, provide its name, website URL, phone number, and full address. Respond as JSON: {"leads":[{"name":"","website":"","phone":"","address":""}]}`;
    const initial = await generateJSON<GeminiInitialResponse>(prompt1);

    const leads: Lead[] = [];

    for (const item of initial.leads.slice(0, limit)) {
      const provenance: ProvenanceEntry[] = [
        {
          source: "ai_initial",
          method: "gemini",
          details: "Initial discovery",
          createdAt: nowIso(),
        },
      ];

      // Step 2: Website scraping via Gemini (targeted)
      let email: string | undefined;
      let contacts: Lead["contacts"] = [];
      if (item.website) {
        const scrapePrompt = `Scrape the live content of the website "${item.website}" to find a primary contact email address. Also, find the full names and job titles of any individuals listed on an 'About Us', 'Team', or 'Contact' page. Return only the extracted data as JSON: {"email":"","contacts":[{"fullName":"","title":"","email":""}]}`;
        try {
          const scraped = await generateJSON<WebsiteScrapeResponse>(scrapePrompt);
          email = scraped.email;
          contacts = scraped.contacts || [];
          provenance.push({
            source: "website",
            method: "gemini",
            details: item.website,
            createdAt: nowIso(),
          });
        } catch (_) {
          // ignore scrape failure
        }
      }

      // Step 3: Public registry (optional, placeholder using Gemini reasoning)
      try {
        const prPrompt = `Perform a real-time web search for public data from the Australian ABN Lookup and ASIC business registries for the business "${item.name}". Extract and return the full names and roles of any registered directors or owners as JSON: {"directors":[{"fullName":"","role":""}]}`;
        const pr = await generateJSON<PublicRegistryResponse>(prPrompt);
        if (pr.directors && pr.directors.length > 0) {
          provenance.push({
            source: "public_registry",
            method: "gemini",
            details: "ABN/ASIC inferred",
            createdAt: nowIso(),
          });
          contacts = contacts || [];
          for (const d of pr.directors) {
            contacts.push({ fullName: d.fullName, title: d.role });
          }
        }
      } catch (_) {}

      // Step 4: Professional network (optional, placeholder using Gemini reasoning)
      try {
        const pnPrompt = `Perform a live web search on LinkedIn for the company "${item.name}". Identify and extract the full names and exact job titles of 1-3 likely decision-makers (e.g., Owner, Founder, CEO, Marketing Director, Head of Sales). Respond JSON: {"decisionMakers":[{"fullName":"","title":""}]}`;
        const pn = await generateJSON<ProfessionalNetworkResponse>(pnPrompt);
        if (pn.decisionMakers && pn.decisionMakers.length > 0) {
          provenance.push({
            source: "professional_network",
            method: "gemini",
            details: "LinkedIn inferred",
            createdAt: nowIso(),
          });
          contacts = contacts || [];
          for (const d of pn.decisionMakers) {
            contacts.push({ fullName: d.fullName, title: d.title });
          }
        }
      } catch (_) {}

      // Basic email validation
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        email = undefined;
      }

      leads.push({
        name: item.name,
        website: item.website,
        phone: item.phone,
        address: item.address,
        email,
        contacts,
        status: "new",
        sources: provenance,
      });
    }

    // Persist to Firestore under user archive
    const db = getAdminDb();
    const runRef = db
      .collection("users")
      .doc(uid)
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

    const serverEnv = SERVER_ENV();
    const keyHints = {
      geminiConfigured: Boolean(serverEnv.GOOGLE_GEMINI_API_KEY),
      serpapiConfigured: Boolean(serverEnv.SERPAPI_API_KEY),
      abrConfigured: Boolean(serverEnv.ABR_GUID),
    };

    // Build source counts for UI filtering
    const sourceCounts: Record<string, number> = {};
    for (const l of leads) {
      for (const s of l.sources) sourceCounts[s.source] = (sourceCounts[s.source] || 0) + 1;
    }

    return NextResponse.json({ runId: runRef.id, leadCount: leads.length, keyHints, leads, sourceCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? "Unknown error" }, { status: 400 });
  }
}


