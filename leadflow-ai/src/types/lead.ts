export type LeadSource =
  | "ai_initial"
  | "website"
  | "public_registry"
  | "professional_network";

export type SourceMethod = "gemini" | "serpapi" | "abr" | "http_fetch" | "manual";

export interface ProvenanceEntry {
  source: LeadSource;
  method: SourceMethod;
  details?: string;
  createdAt: string; // ISO date
}

export interface ContactPerson {
  fullName: string;
  title?: string;
  email?: string;
}

export interface Lead {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
  contacts?: ContactPerson[];
  locationCity?: string;
  locationState?: string;
  aiScore?: number;
  status?: "new" | "analyzed" | "email_generated" | "email_sent";
  sources: ProvenanceEntry[];
}

export interface LeadRun {
  date: string; // ISO
  keywords: string;
  locations: string;
  leadCount: number;
  leads: Lead[];
}

