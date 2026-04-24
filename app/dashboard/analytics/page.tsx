import Link from "next/link";

const linkClass =
  "inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-surface";

export default function DashboardAnalyticsPage() {
  const webAnalytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL?.trim();
  const projectHome = process.env.NEXT_PUBLIC_VERCEL_PROJECT_URL?.trim();
  const speedInsights = process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_URL?.trim();

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-2xl font-bold text-foreground">Site analytics</h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Traffic, page views, and custom events are collected by{" "}
          <strong>Vercel Web Analytics</strong> (see the{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-xs">&lt;Analytics /&gt;</code>{" "}
          component in the root layout). Detailed breakdowns are viewed in the
          Vercel dashboard, not inside this app.
        </p>

        <ul className="mt-8 flex flex-col gap-3">
          {webAnalytics ? (
            <li>
              <a
                href={webAnalytics}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Open Web Analytics (Vercel)
              </a>
            </li>
          ) : (
            <li className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Set{" "}
              <code className="rounded bg-white/80 px-1 py-0.5 text-xs">
                NEXT_PUBLIC_VERCEL_ANALYTICS_URL
              </code>{" "}
              in Vercel env to your project&apos;s Analytics / Observability URL,
              then redeploy.
            </li>
          )}
          {speedInsights ? (
            <li>
              <a
                href={speedInsights}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Open Speed Insights (Vercel)
              </a>
            </li>
          ) : null}
          {projectHome ? (
            <li>
              <a
                href={projectHome}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Open project on Vercel
              </a>
            </li>
          ) : null}
          <li>
            <Link href="/create/newsletter" className={linkClass}>
              Back to admin dashboard
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
