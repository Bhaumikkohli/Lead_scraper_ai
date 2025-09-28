"use client";

import { useEffect, useState } from "react";
import { DashboardGrid } from "@/components/DashboardGrid";
import { DashboardWidgetInstance, UserDashboard } from "@/types/dashboard";

export default function Home() {
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboards");
        const json = await res.json();
        const d = (json.dashboards || [])[0] || null;
        setDashboard(d);
      } catch {}
    }
    load();
  }, []);

  async function handleChange(widgets: DashboardWidgetInstance[]) {
    // Persist ad-hoc; in real app, debounce
    const body = { id: dashboard?.id, name: dashboard?.name || "My Dashboard", widgets, isDefault: true };
    const res = await fetch("/api/dashboards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setDashboard(json);
  }

  return (
    <div className="space-y-6">
      <DashboardGrid widgets={dashboard?.widgets || []} onChange={handleChange} />
    </div>
  );
}

