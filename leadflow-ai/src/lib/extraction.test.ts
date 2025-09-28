import { describe, expect, it } from "vitest";
import { extractEmailsFromHtml, parseSerpToLeads, pickAbn, pickBestEmail, isAbrActive } from "./extraction";

describe("extraction utils", () => {
  it("parses SERP results to leads with limit", () => {
    const leads = parseSerpToLeads([
      { title: "A Pty Ltd", link: "https://a.com" },
      { title: "B Pty Ltd", link: "https://b.com" },
      { title: "C Pty Ltd", link: "" },
    ], 1);
    expect(leads).toEqual([{ name: "A Pty Ltd", website: "https://a.com" }]);
  });

  it("extracts emails from html and dedupes", () => {
    const html = `<a href=mailto:sales@acme.com>sales@acme.com</a> contact: Sales@Acme.com`;
    const emails = extractEmailsFromHtml(html);
    expect(emails.map(e => e.toLowerCase())).toEqual(["sales@acme.com"]);
  });

  it("picks best email avoiding info@ and example/noreply", () => {
    expect(pickBestEmail(["info@acme.com", "team@acme.com"])) .toBe("team@acme.com");
    expect(pickBestEmail(["noreply@acme.com", "sales@acme.com"])) .toBe("sales@acme.com");
    expect(pickBestEmail([])).toBeUndefined();
  });

  it("picks first ABN from matches", () => {
    expect(pickAbn([{ Abn: "123" }, { Abn: "456" }])).toBe("123");
    expect(pickAbn([])).toBeUndefined();
    expect(pickAbn(undefined as any)).toBeUndefined();
  });

  it("detects ABR active status", () => {
    expect(isAbrActive({ EntityStatus: { EntityStatusCode: "Active" } })).toBe(true);
    expect(isAbrActive({ EntityStatus: { EntityStatusCode: "Cancelled" } })).toBe(false);
  });
});

