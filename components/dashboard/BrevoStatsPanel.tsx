"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";

type Stats = {
  requests?: number;
  delivered?: number;
  opens?: number;
  clicks?: number;
  bounces?: number;
};

type Props = {
  className?: string;
};

export default function BrevoStatsPanel({ className = "" }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/newsletter/brevo-stats", {
        cache: "no-store",
      });
      if (!res.ok) {
        setStats(null);
        setErr("Could not load Brevo stats (check API key).");
        return;
      }
      const data = await res.json();
      setStats(data.stats ?? null);
    } catch {
      setErr("Network error.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <p className={`text-sm text-muted ${className}`.trim()}>
        Loading metrics…
      </p>
    );
  }

  if (err) {
    return (
      <div className={className}>
        <p className="text-sm text-muted">{err}</p>
        <Button type="button" variant="outline" className="mt-2" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (!stats || stats.requests == null) {
    return (
      <p className={`text-sm text-muted ${className}`.trim()}>
        No Brevo aggregated data returned. Add{" "}
        <code className="text-xs">BREVO_API_KEY</code> to env.
      </p>
    );
  }

  const delivered = stats.delivered ?? 0;
  const opens = stats.opens ?? 0;
  const clicks = stats.clicks ?? 0;
  const bounces = stats.bounces ?? 0;
  const openRate = delivered ? ((opens / delivered) * 100).toFixed(1) : "0";
  const clickRate = delivered ? ((clicks / delivered) * 100).toFixed(1) : "0";
  const bounceRate = delivered ? ((bounces / delivered) * 100).toFixed(1) : "0";

  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-4 ${className}`.trim()}>
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-muted">Open rate (est.)</p>
        <p className="text-2xl font-bold">{openRate}%</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-muted">Click rate (est.)</p>
        <p className="text-2xl font-bold">{clickRate}%</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-muted">Bounce rate (est.)</p>
        <p className="text-2xl font-bold">{bounceRate}%</p>
      </div>
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <p className="text-xs text-muted">Requests (30d)</p>
        <p className="text-2xl font-bold">{stats.requests ?? 0}</p>
      </div>
      <div className="col-span-full">
        <Button type="button" variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
    </div>
  );
}
