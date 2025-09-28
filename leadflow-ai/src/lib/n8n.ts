import { SERVER_ENV } from "@/lib/env";

export async function callN8nWebhook(event: string, payload: unknown) {
  const env = SERVER_ENV();
  const url = env.N8N_WEBHOOK_URL || env.N8N_URL;
  if (!url) return { ok: false, skipped: true } as const;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (env.N8N_WEBHOOK_BASIC_USER && env.N8N_WEBHOOK_BASIC_PASS) {
    const token = Buffer.from(`${env.N8N_WEBHOOK_BASIC_USER}:${env.N8N_WEBHOOK_BASIC_PASS}`).toString("base64");
    headers["authorization"] = `Basic ${token}`;
  }
  if (env.N8N_WEBHOOK_HEADER_NAME && env.N8N_WEBHOOK_HEADER_VALUE) {
    headers[env.N8N_WEBHOOK_HEADER_NAME] = env.N8N_WEBHOOK_HEADER_VALUE;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ event, payload, ts: new Date().toISOString() }),
  });
  return { ok: res.ok, status: res.status } as const;
}

