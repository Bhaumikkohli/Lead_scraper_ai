export type SerpResult = { title: string; link: string };

export function parseSerpToLeads(results: SerpResult[], limit: number) {
  const leads = results
    .map((r) => ({ name: r.title, website: r.link }))
    .filter((l) => Boolean(l.website))
    .slice(0, limit);
  return leads;
}

export function extractEmailsFromHtml(html: string): string[] {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  const matches = html.match(emailRegex) || [];
  const unique = Array.from(new Set(matches));
  return unique;
}

export function pickBestEmail(candidates: string[]): string | undefined {
  if (!candidates || candidates.length === 0) return undefined;
  const filtered = candidates.filter((e) => !/example\.|noreply@|donotreply@/i.test(e) && !/^info@/i.test(e));
  return (filtered[0] || candidates[0])?.toLowerCase();
}

export type AbrNameMatch = { Abn?: string };

export function pickAbn(matches: AbrNameMatch[]): string | undefined {
  if (!Array.isArray(matches)) return undefined;
  return matches[0]?.Abn;
}

export function isAbrActive(details: any): boolean {
  return details?.EntityStatus?.EntityStatusCode === "Active";
}

