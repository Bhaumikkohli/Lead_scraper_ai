export type DashboardWidgetType =
  | "kpiBar"
  | "funnel"
  | "sourceBreakdown"
  | "campaignPerformance"
  | "industryBreakdown"
  | "geoMap"
  | "recommendations"
  | "scoreDistribution";

export interface DashboardWidgetInstance {
  id: string;
  type: DashboardWidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  props?: Record<string, unknown>;
}

export interface UserDashboard {
  id: string;
  name: string;
  widgets: DashboardWidgetInstance[];
  isDefault?: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type KPIResponse = {
  totalLeads: number;
  newLeads24h: number;
  newLeads7d: number;
  newLeads30d: number;
  successfulJobs: number;
  failedJobs: number;
  activeCampaigns: number;
  lastUpdated: string; // ISO
};

export type ScoreBucket = {
  label: string; // Hot, Warm, Cold
  count: number;
};

