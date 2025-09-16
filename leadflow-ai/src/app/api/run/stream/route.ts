import { NextRequest } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/gemini";
import { getAdminDb } from "@/lib/firebase/admin";
import { Lead, ProvenanceEntry } from "@/types/lead";
import { SERVER_ENV, getKeyStatus } from "@/lib/env";

export const runtime = "nodejs";

const querySchema = z.object({
  userId: z.string().min(1),
  keywords: z.string().min(1),
  locations: z.string().min(1),
  limit: z.string().regex(/^\d+$/).transform((v) => Math.min(50, Math.max(1, parseInt(v, 10)))),
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
  decisionMakers?: { fullName: string; title: string; profileUrl?: string }[];
};

function nowIso() {
  return new Date().toISOString();
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return new Response("Invalid query", { status: 400 });
  }
  const { userId, keywords, locations } = parsed.data;
  const limit = parsed.data.limit;

  const keyStatus = getKeyStatus();
  if (!keyStatus.geminiReady) {
    return new Response("Missing keys", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));
      }, 15000);

      (async () => {
        try {
          send("status", { step: "init", message: "Starting lead run" });

          // Step 1: Initial lead discovery via Gemini
          send("status", { step: "ai_initial", state: "start", message: "Discovering businesses" });
          const prompt1 = `Find ${limit} real businesses in Australia related to "${keywords}" in cities like "${locations}". For each business, provide its name, website URL, phone number, and full address. Respond as JSON: {"leads":[{"name":"","website":"","phone":"","address":""}]}`;
          const initial = await generateJSON<GeminiInitialResponse>(prompt1);
          send("status", { step: "ai_initial", state: "done", message: `Found ${initial.leads.length} candidates` });

          const leads: Lead[] = [];

          // Step 2: Website scraping via Gemini
          send("status", { step: "website", state: "start", message: "Scraping websites for contacts" });
          for (const item of initial.leads.slice(0, limit)) {
            const provenance: ProvenanceEntry[] = [
              { source: "ai_initial", method: "gemini", details: "Initial discovery", createdAt: nowIso() },
            ];
            let email: string | undefined;
            let contacts: Lead["contacts"] = [];
            if (item.website) {
              try {
                const scrapePrompt = `Scrape the live content of the website "${item.website}" to find a primary contact email address. Also, find the full names and job titles of any individuals listed on an 'About Us', 'Team', or 'Contact' page. Return only the extracted data as JSON: {"email":"","contacts":[{"fullName":"","title":"","email":""}]}`;
                const scraped = await generateJSON<WebsiteScrapeResponse>(scrapePrompt);
                email = scraped.email;
                contacts = scraped.contacts || [];
                provenance.push({ source: "website", method: "gemini", details: item.website, createdAt: nowIso() });
              } catch {}
            }

            // Step 3: Public registry
            send("status", { step: "public_registry", state: "start", message: `Searching ABR/ASIC for ${item.name}` });
            try {
              const prPrompt = `Perform a real-time web search for public data from the Australian ABN Lookup and ASIC business registries for the business "${item.name}". Extract and return the full names and roles of any registered directors or owners as JSON: {"directors":[{"fullName":"","role":""}]}`;
              const pr = await generateJSON<PublicRegistryResponse>(prPrompt);
              if (pr.directors && pr.directors.length > 0) {
                provenance.push({ source: "public_registry", method: "gemini", details: "ABN/ASIC inferred", createdAt: nowIso() });
                contacts = contacts || [];
                for (const d of pr.directors) contacts.push({ fullName: d.fullName, title: d.role });
              }
            } catch {}
            send("status", { step: "public_registry", state: "done", message: `Registry lookup processed for ${item.name}` });

            // Step 4: LinkedIn enrichment
            send("status", { step: "linkedin", state: "start", message: `Scanning LinkedIn for ${item.name}` });
            try {
              const pnPrompt = `Perform a live web search on LinkedIn for the company "${item.name}". Identify and extract the full names and exact job titles of 1-3 likely decision-makers (e.g., Owner, Founder, CEO, Marketing Director, Head of Sales). Respond JSON: {"decisionMakers":[{"fullName":"","title":"","profileUrl":""}]}`;
              const pn = await generateJSON<ProfessionalNetworkResponse>(pnPrompt);
              if (pn.decisionMakers && pn.decisionMakers.length > 0) {
                provenance.push({ source: "linkedin", method: "gemini", details: "LinkedIn inferred", createdAt: nowIso() });
                contacts = contacts || [];
                for (const d of pn.decisionMakers) contacts.push({ fullName: d.fullName, title: d.title });
              }
            } catch {}
            send("status", { step: "linkedin", state: "done", message: `LinkedIn enrichment processed for ${item.name}` });

            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) email = undefined;

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
          send("status", { step: "website", state: "done", message: "Website scrape completed" });

          // Persist
          const serverEnv = SERVER_ENV();
          let runId = "local-dev";
          try {
            if (serverEnv.FIREBASE_PROJECT_ID && serverEnv.FIREBASE_CLIENT_EMAIL && serverEnv.FIREBASE_PRIVATE_KEY) {
              const db = getAdminDb();
              const runRef = db.collection("users").doc(userId).collection("archive").doc();
              await runRef.set({ date: new Date(), keywords, locations, leadCount: leads.length, leads } as any);
              runId = runRef.id;
            }
          } catch {}

          send("completed", { runId, leadCount: leads.length, leads });
          clearInterval(heartbeat);
          controller.close();
        } catch (e: any) {
          controller.enqueue(encoder.encode(`event: error\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: e?.message || "Unknown error" })}\n\n`));
          clearInterval(heartbeat);
          controller.close();
        }
      })();
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

