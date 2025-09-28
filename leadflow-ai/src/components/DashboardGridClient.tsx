"use client";

import { useEffect } from "react";
import { DashboardGrid } from "./DashboardGrid";
import { DashboardWidgetInstance } from "@/types/dashboard";

export function DashboardGridClient({ widgets, onChange }: { widgets: DashboardWidgetInstance[]; onChange?: (w: DashboardWidgetInstance[]) => void }) {
  useEffect(() => {
    // Load styles only on client to avoid SSR resolution issues
    Promise.all([
      import("react-grid-layout/css/styles.css"),
      import("react-resizable/css/styles.css"),
    ]).catch(() => {});
  }, []);
  return <DashboardGrid widgets={widgets} onChange={onChange} />;
}