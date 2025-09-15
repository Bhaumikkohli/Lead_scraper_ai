export type LeadSource =
  | "ai_initial"
  | "website"
  | "public_registry"
  | "professional_network"
  | "linkedin";

export type SourceMethod =
  | "gemini"
  | "serpapi"
  | "abr"
  | "http_fetch"
  | "manual"
  | "linkedin";

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

export interface LinkedInProfile {
  fullName: string;
  title?: string;
  profileUrl?: string;
  location?: string;
  linkedinId?: string;
  isDecisionMaker?: boolean;
}

export interface LinkedInCompanyMeta {
  companyUrl?: string;
  companyId?: string;
  industry?: string;
  headquarters?: string;
  employeeCount?: number;
}

export interface Lead {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  email?: string;
  contacts?: ContactPerson[];
  linkedinCompany?: LinkedInCompanyMeta;
  linkedinProfiles?: LinkedInProfile[];
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

