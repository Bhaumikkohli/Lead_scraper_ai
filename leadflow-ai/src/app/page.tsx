"use client";

import { useEffect, useState } from "react";
import { DashboardGrid } from "@/components/DashboardGrid";
import { DashboardWidgetInstance, UserDashboard } from "@/types/dashboard";
import { authFetch } from "@/lib/authFetch";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const [dashboard, setDashboard] = useState<UserDashboard | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await authFetch("/api/dashboards");
        const json = await res.json();
        const d = (json.dashboards || [])[0] || null;
        setDashboard(d);
      } catch {}
    }
    if (user) load();
  }, [user]);

  async function handleChange(widgets: DashboardWidgetInstance[]) {
    // Persist ad-hoc; in real app, debounce
    const body = { id: dashboard?.id, name: dashboard?.name || "My Dashboard", widgets, isDefault: true };
    const res = await authFetch("/api/dashboards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    setDashboard(json);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] grid place-items-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#0CF29D] border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/signin";
    return null;
  }

  return (
    <div className="space-y-6">
      <DashboardGrid widgets={dashboard?.widgets || []} onChange={handleChange} />
    </div>
  );
}

