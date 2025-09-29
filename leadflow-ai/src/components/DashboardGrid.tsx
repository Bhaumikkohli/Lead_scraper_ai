"use client";

import { Responsive as ResponsiveCore, WidthProvider } from "react-grid-layout";
import { useEffect, useMemo, useState } from "react";
import { KPIBar } from "./KPIBar";
import { FunnelChart } from "./widgets/FunnelChart";
import { SourceBreakdown } from "./widgets/SourceBreakdown";
import { CampaignPerformance } from "./widgets/CampaignPerformance";
import { IndustryBreakdown } from "./widgets/IndustryBreakdown";
import { GeoMap } from "./widgets/GeoMap";
import { Recommendations } from "./widgets/Recommendations";
import { RunPanel } from "./widgets/RunPanel";
import { DashboardWidgetInstance } from "@/types/dashboard";

const ResponsiveGridLayout: any = WidthProvider(ResponsiveCore as any);

type Props = {
  widgets: DashboardWidgetInstance[];
  onChange?: (widgets: DashboardWidgetInstance[]) => void;
};

const defaultWidgets: DashboardWidgetInstance[] = [
  { id: "kpi", type: "kpiBar", x: 0, y: 0, w: 12, h: 3 },
  { id: "runpanel", type: "runPanel", x: 6, y: 3, w: 6, h: 8 },
  { id: "funnel", type: "funnel", x: 0, y: 3, w: 6, h: 6 },
  { id: "source", type: "sourceBreakdown", x: 6, y: 3, w: 6, h: 6 },
  { id: "campaign", type: "campaignPerformance", x: 0, y: 9, w: 12, h: 6 },
  { id: "industry", type: "industryBreakdown", x: 0, y: 15, w: 6, h: 6 },
  { id: "map", type: "geoMap", x: 6, y: 15, w: 6, h: 6 },
  { id: "reco", type: "recommendations", x: 0, y: 21, w: 12, h: 4 },
];

export function DashboardGrid({ widgets: initial, onChange }: Props) {
  const [widgets, setWidgets] = useState<DashboardWidgetInstance[]>(initial?.length ? initial : defaultWidgets);

  useEffect(() => {
    if (initial && initial.length) setWidgets(initial);
  }, [initial]);

  const layouts = useMemo(() => {
    const lg = widgets.map((w) => ({ i: w.id, x: w.x, y: w.y, w: w.w, h: w.h }));
    return { lg } as any;
  }, [widgets]);

  function handleLayoutChange(_: any, allLayouts: any) {
    const lg = allLayouts.lg || [];
    const next = widgets.map((w) => {
      const l = lg.find((i: any) => i.i === w.id);
      if (!l) return w;
      return { ...w, x: l.x, y: l.y, w: l.w, h: l.h };
    });
    setWidgets(next);
    onChange?.(next);
  }

  function renderWidget(w: DashboardWidgetInstance) {
    switch (w.type) {
      case "kpiBar":
        return <KPIBar />;
      case "runPanel":
        return <RunPanel />;
      case "funnel":
        return (
          <FunnelChart
            stages={[
              { label: "Prospects Identified", value: 100 },
              { label: "Leads Scraped", value: 70 },
              { label: "Leads Qualified (AI)", value: 40 },
              { label: "Leads Contacted", value: 15 },
            ]}
          />
        );
      case "sourceBreakdown":
        return <SourceBreakdown data={[{ name: "LinkedIn", value: 40 }, { name: "Web", value: 35 }, { name: "Lists", value: 25 }]} />;
      case "campaignPerformance":
        return (
          <CampaignPerformance
            data={[
              { date: "Mon", openRate: 42, clickRate: 10, replyRate: 3, bounceRate: 1 },
              { date: "Tue", openRate: 48, clickRate: 12, replyRate: 4, bounceRate: 1 },
              { date: "Wed", openRate: 55, clickRate: 14, replyRate: 5, bounceRate: 2 },
              { date: "Thu", openRate: 50, clickRate: 13, replyRate: 4, bounceRate: 1 },
              { date: "Fri", openRate: 58, clickRate: 16, replyRate: 6, bounceRate: 1 },
            ]}
          />
        );
      case "industryBreakdown":
        return <IndustryBreakdown data={[{ industry: "Tech", count: 24 }, { industry: "Retail", count: 12 }, { industry: "Health", count: 14 }, { industry: "Finance", count: 9 }]} />;
      case "geoMap":
        return <GeoMap points={[{ name: "Sydney", coordinates: [151.2093, -33.8688], count: 20 }, { name: "Melbourne", coordinates: [144.9631, -37.8136], count: 15 }]} />;
      case "recommendations":
        return <Recommendations />;
      default:
        return null;
    }
  }

  return (
    <div>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={24}
        margin={[16, 16]}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        draggableHandle=".drag-handle"
      >
        {widgets.map((w) => (
          <div key={w.id} data-grid={{ x: w.x, y: w.y, w: w.w, h: w.h }}>
            {renderWidget(w)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

