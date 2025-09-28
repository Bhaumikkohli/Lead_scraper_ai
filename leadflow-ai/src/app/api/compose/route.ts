import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/gemini";

const bodySchema = z.object({
  lead: z.object({
    name: z.string(),
    website: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  }),
  adminNote: z.string().default("")
});

type ComposeResponse = {
  summary: string;
  email: {
    subject: string;
    body: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { lead, adminNote } = bodySchema.parse(json);
    const prompt = `You are a B2B researcher and copywriter. Research the company ${lead.name} ${lead.website ? `(website: ${lead.website})` : ""} based in Australia. Provide a concise 5-7 sentence summary from public info. Then, draft a concise outreach email tailored to local customer acquisition, referencing the research. If provided, incorporate the admin's service note: "${adminNote}" into the value proposition. Return JSON: {"summary":"","email":{"subject":"","body":""}}`;
    const data = await generateJSON<ComposeResponse>(prompt);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "compose failed" }, { status: 400 });
  }
}

