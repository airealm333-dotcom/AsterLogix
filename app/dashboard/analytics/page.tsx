import Link from "next/link";

const linkClass =
  "inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-surface";

export default function DashboardAnalyticsPage() {
  const webAnalytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_URL?.trim();
  const projectHome = process.env.NEXT_PUBLIC_VERCEL_PROJECT_URL?.trim();
  const speedInsights = process.env.NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_URL?.trim();
  const umamiShareUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL?.trim();

  const showVercelUrlWarning = !webAnalytics && !umamiShareUrl;

  return (
    <main className="min-h-screen bg-surface">
      <div
        className={`mx-auto px-6 py-24 ${umamiShareUrl ? "max-w-6xl" : "max-w-2xl"}`}
      >
        <h1 className="text-2xl font-bold text-foreground">Site analytics</h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          {umamiShareUrl ? (
            <>
              Traffic and page views for this site can be viewed below via{" "}
              <strong>Umami</strong> (self-hosted analytics). The tracker is
              loaded from your Umami instance when{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_UMAMI_SCRIPT_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_UMAMI_WEBSITE_ID
              </code>{" "}
              are set in the root layout. You can still use{" "}
              <strong>Vercel Web Analytics</strong> and{" "}
              <strong>Speed Insights</strong> in parallel unless disabled with{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_VERCEL_ANALYTICS_DISABLED
              </code>{" "}
              /{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_DISABLED
              </code>
              .
            </>
          ) : (
            <>
              Traffic, page views, and custom events may be collected by{" "}
              <strong>Vercel Web Analytics</strong> and{" "}
              <strong>Speed Insights</strong> when enabled in the root layout, or
              by <strong>Umami</strong> when{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_UMAMI_SCRIPT_URL
              </code>{" "}
              and{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_UMAMI_WEBSITE_ID
              </code>{" "}
              are set. Set{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-xs">
                NEXT_PUBLIC_UMAMI_SHARE_URL
              </code>{" "}
              to embed a shared Umami dashboard here.
            </>
          )}
        </p>

        {umamiShareUrl ? (
          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <iframe
              title="Umami analytics"
              src={umamiShareUrl}
              className="h-[min(80vh,900px)] w-full border-0"
              allow="fullscreen"
            />
            <p className="border-t border-border bg-surface px-3 py-2 text-xs text-muted">
              If this area is blank, your Umami host may block embedding
              (check{" "}
              <code className="rounded bg-white px-1 py-0.5">X-Frame-Options</code>{" "}
              /{" "}
              <code className="rounded bg-white px-1 py-0.5">Content-Security-Policy</code>{" "}
              on the share URL).
            </p>
          </div>
        ) : null}

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
          ) : showVercelUrlWarning ? (
            <li className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Set{" "}
              <code className="rounded bg-white/80 px-1 py-0.5 text-xs">
                NEXT_PUBLIC_VERCEL_ANALYTICS_URL
              </code>{" "}
              in Vercel env to your project&apos;s Analytics / Observability URL,
              then redeploy — or configure Umami (see above).
            </li>
          ) : null}
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
