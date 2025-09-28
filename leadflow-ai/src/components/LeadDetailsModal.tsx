"use client";

import { useState } from "react";
import type { Lead } from "@/types/lead";

type Props = {
  lead: Lead | null;
  onClose: () => void;
};

export default function LeadDetailsModal({ lead, onClose }: Props) {
  const [summary, setSummary] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [emailBody, setEmailBody] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  if (!lead) return null;

  async function compose() {
    try {
      setLoading(true);
      const res = await fetch("/api/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: { name: lead.name, website: lead.website, email: lead.email, address: lead.address }, adminNote }),
      });
      const json = await res.json();
      setSummary(json.summary || "");
      setEmailSubject(json.email?.subject || "");
      setEmailBody(json.email?.body || "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5 shadow-[0_0_0_1px_#0CF29D20,0_0_30px_#0CF29D10]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm uppercase tracking-widest text-[#9BCDBA]">Lead Details</div>
          <button onClick={onClose} className="text-[#9BCDBA] text-sm">Close</button>
        </div>
        <div className="space-y-3">
          <div className="text-[#CDE7D8] text-sm">
            <div className="font-semibold">{lead.name}</div>
            <div className="text-xs text-[#9BCDBA]">{lead.website || "No website"} • {lead.email || "No email"}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[#9BCDBA] mb-1">Admin note (services)</div>
              <textarea value={adminNote} onChange={(e)=>setAdminNote(e.target.value)} rows={3} className="w-full bg-[#0B1012] border border-[#1E2A29] rounded-md px-3 py-2 text-sm" placeholder="e.g., Local SEO + Google Ads setup" />
            </div>
            <div className="flex items-end">
              <button onClick={compose} disabled={loading} className="w-full bg-[#0CF29D] text-black rounded-md py-2 text-sm font-semibold hover:brightness-90 transition disabled:opacity-60">{loading?"Composing...":"Generate Research + Email"}</button>
            </div>
          </div>
          {summary && (
            <div className="border border-[#1E2A29] rounded-md p-3">
              <div className="text-xs uppercase tracking-widest text-[#9BCDBA] mb-2">AI Research Summary</div>
              <div className="text-sm text-[#CDE7D8] whitespace-pre-wrap">{summary}</div>
            </div>
          )}
          {(emailSubject || emailBody) && (
            <div className="border border-[#1E2A29] rounded-md p-3">
              <div className="text-xs uppercase tracking-widest text-[#9BCDBA] mb-2">Outreach Email</div>
              <div className="text-sm text-[#CDE7D8]"><span className="text-[#9BCDBA]">Subject:</span> {emailSubject}</div>
              <pre className="text-sm text-[#CDE7D8] whitespace-pre-wrap mt-2">{emailBody}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

