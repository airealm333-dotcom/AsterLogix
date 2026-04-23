"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { LayoutList, Pencil, Table2, X } from "lucide-react";
import AdminBlogPostDeleteButton from "@/components/blog/AdminBlogPostDeleteButton";
import SubscriberTagsRow from "@/components/dashboard/SubscriberTagsRow";
import SubscribersTablePanel, {
  type SubscriberRow,
} from "@/components/dashboard/SubscribersTablePanel";

export type CampaignSummaryRow = {
  id: string;
  subject: string;
  status: string;
  created_at: string | null;
  sent_at: string | null;
  scheduled_at: string | null;
  audience_tags: string[] | null;
};

export type BlogSummaryRow = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
};

type OpenPanel = "subscribers" | "blogs" | "campaigns" | null;
type ViewMode = "table" | "list";

const statCardClass =
  "flex min-h-[92px] w-full flex-col justify-center rounded-xl border border-border bg-white p-4 text-left shadow-sm transition-colors hover:border-primary/35 hover:bg-surface/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

function formatUtc(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min} UTC`;
}

function statusBadgeClass(status: string): string {
  const base =
    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide";
  switch (status) {
    case "sent":
      return `${base} bg-emerald-100 text-emerald-800`;
    case "scheduled":
      return `${base} bg-sky-100 text-sky-800`;
    case "sending":
      return `${base} bg-amber-100 text-amber-900`;
    case "draft":
      return `${base} bg-zinc-100 text-zinc-700`;
    case "cancelled":
      return `${base} bg-rose-100 text-rose-800`;
    default:
      return `${base} bg-zinc-100 text-zinc-600`;
  }
}

const toggleBtn =
  "inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-surface";

export default function AdminOverviewMetrics({
  subscriberRows,
  subscriberCount,
  campaigns,
  blogs,
}: {
  /** Capped (e.g. 2000) for overview; `subscriberCount` is total in DB. */
  subscriberRows: SubscriberRow[];
  subscriberCount: number;
  campaigns: CampaignSummaryRow[];
  blogs: BlogSummaryRow[];
}) {
  const [open, setOpen] = useState<OpenPanel>(null);
  const [view, setView] = useState<ViewMode>("table");

  const togglePanel = useCallback((p: Exclude<OpenPanel, null>) => {
    setOpen((cur) => (cur === p ? null : p));
  }, []);

  const close = useCallback(() => setOpen(null), []);

  const title = useMemo(() => {
    if (open === "subscribers") return "Subscribers";
    if (open === "blogs") return "Published blogs";
    if (open === "campaigns") return "Newsletter campaigns";
    return "";
  }, [open]);

  const subscriberListTruncated = subscriberCount > subscriberRows.length;

  return (
    <>
      <section
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Overview metrics"
      >
        <button
          type="button"
          className={`${statCardClass} ${open === "subscribers" ? "border-primary/50 ring-2 ring-primary/25" : ""}`}
          onClick={() => togglePanel("subscribers")}
          aria-expanded={open === "subscribers"}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Subscribers
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {subscriberCount}
          </p>
          <p className="mt-1 text-[11px] text-muted">Click to expand list</p>
        </button>
        <button
          type="button"
          className={`${statCardClass} ${open === "blogs" ? "border-primary/50 ring-2 ring-primary/25" : ""}`}
          onClick={() => togglePanel("blogs")}
          aria-expanded={open === "blogs"}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Published blogs
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {blogs.length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Click to expand list</p>
        </button>
        <button
          type="button"
          className={`${statCardClass} ${open === "campaigns" ? "border-primary/50 ring-2 ring-primary/25" : ""}`}
          onClick={() => togglePanel("campaigns")}
          aria-expanded={open === "campaigns"}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Newsletter campaigns
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {campaigns.length}
          </p>
          <p className="mt-1 text-[11px] text-muted">Click to expand list</p>
        </button>
      </section>

      {open ? (
        <div
          className="mt-4 overflow-hidden rounded-xl border-2 border-border bg-white shadow-sm outline outline-1 outline-border/60"
          role="region"
          aria-label={title}
        >
          <div className="flex flex-col gap-3 border-b border-border bg-surface/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="sr-only" id="dash-metric-view-label">
                Layout
              </span>
              <div
                className="inline-flex rounded-lg border border-border bg-white p-0.5 shadow-sm"
                role="group"
                aria-labelledby="dash-metric-view-label"
              >
                <button
                  type="button"
                  className={`${toggleBtn} rounded-md border-0 shadow-none ${view === "table" ? "bg-primary/15 text-foreground ring-1 ring-primary/30" : ""}`}
                  onClick={() => setView("table")}
                  aria-pressed={view === "table"}
                >
                  <Table2 className="h-3.5 w-3.5" aria-hidden />
                  Table
                </button>
                <button
                  type="button"
                  className={`${toggleBtn} rounded-md border-0 shadow-none ${view === "list" ? "bg-primary/15 text-foreground ring-1 ring-primary/30" : ""}`}
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                >
                  <LayoutList className="h-3.5 w-3.5" aria-hidden />
                  List
                </button>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-muted shadow-sm transition-colors hover:bg-red-50 hover:text-red-800"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Close
              </button>
            </div>
          </div>

          <div className="max-h-[min(70vh,560px)] overflow-auto p-4">
            {open === "subscribers" && subscriberListTruncated ? (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                Showing the most recent {subscriberRows.length} of{" "}
                {subscriberCount} subscribers. Use the{" "}
                <strong>Subscribers</strong> tab for full pagination.
              </p>
            ) : null}
            {open === "subscribers" && view === "table" ? (
              <SubscribersTablePanel
                rows={subscriberRows}
                errorMessage={null}
                page={1}
                totalPages={1}
                count={subscriberCount}
                prevHref={null}
                nextHref={null}
              />
            ) : null}

            {open === "subscribers" && view === "list" ? (
              <ul className="space-y-3">
                {subscriberRows.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-lg border border-border bg-surface/40 px-4 py-3"
                  >
                    <p className="font-medium text-foreground">{s.email}</p>
                    <p className="mt-1 text-xs tabular-nums text-muted">
                      Joined {formatUtc(s.created_at)}
                    </p>
                    <div className="mt-2">
                      <SubscriberTagsRow
                        subscriberId={s.id}
                        tags={s.tags ?? []}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {open === "blogs" && view === "table" ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-border bg-surface/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="border border-border px-3 py-2">
                        Title
                      </th>
                      <th className="border border-border px-3 py-2">
                        Category
                      </th>
                      <th className="border border-border px-3 py-2">
                        Published
                      </th>
                      <th className="border border-border px-3 py-2">
                        Link
                      </th>
                      <th className="border border-border px-3 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr
                        key={b.slug}
                        className="border-b border-border odd:bg-white even:bg-surface/30"
                      >
                        <td className="border border-border px-3 py-2 font-medium text-foreground">
                          {b.title}
                        </td>
                        <td className="border border-border px-3 py-2 text-muted">
                          {b.category}
                        </td>
                        <td className="border border-border px-3 py-2 text-xs tabular-nums text-muted">
                          {b.publishedAt}
                        </td>
                        <td className="border border-border px-3 py-2">
                          <Link
                            href={`/blog/${b.slug}`}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            View
                          </Link>
                        </td>
                        <td className="border border-border px-3 py-2 align-top">
                          <div className="flex min-w-[7rem] flex-wrap items-center gap-x-3 gap-y-1">
                            <Link
                              href={`/create/newsletter?tab=blog&edit=${encodeURIComponent(b.slug)}`}
                              className="inline-flex items-center justify-center rounded-md p-1 text-primary transition-colors hover:bg-primary/10"
                              aria-label={`Edit ${b.title}`}
                              title="Edit post"
                            >
                              <Pencil className="h-3 w-3 shrink-0" aria-hidden />
                              <span className="sr-only">Edit</span>
                            </Link>
                            <AdminBlogPostDeleteButton slug={b.slug} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {open === "blogs" && view === "list" ? (
              <ul className="space-y-2">
                {blogs.map((b) => (
                  <li
                    key={b.slug}
                    className="rounded-lg border border-border bg-surface/40 px-4 py-3"
                  >
                    <p className="font-semibold text-foreground">{b.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {b.category} · {b.publishedAt}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="inline-block text-xs font-semibold text-primary hover:underline"
                      >
                        Open post
                      </Link>
                      <Link
                        href={`/create/newsletter?tab=blog&edit=${encodeURIComponent(b.slug)}`}
                        className="inline-flex items-center justify-center rounded-md p-1 text-primary transition-colors hover:bg-primary/10"
                        aria-label={`Edit ${b.title}`}
                        title="Edit post"
                      >
                        <Pencil className="h-3 w-3 shrink-0" aria-hidden />
                        <span className="sr-only">Edit in dashboard</span>
                      </Link>
                      <AdminBlogPostDeleteButton slug={b.slug} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {open === "campaigns" && view === "table" ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-border bg-surface/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      <th className="border border-border px-3 py-2">
                        Subject
                      </th>
                      <th className="border border-border px-3 py-2">
                        Status
                      </th>
                      <th className="border border-border px-3 py-2">
                        Audience tags
                      </th>
                      <th className="border border-border px-3 py-2">
                        Created
                      </th>
                      <th className="border border-border px-3 py-2">
                        Sent / scheduled
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border odd:bg-white even:bg-surface/30"
                      >
                        <td className="border border-border px-3 py-2 font-medium text-foreground">
                          {c.subject}
                        </td>
                        <td className="border border-border px-3 py-2">
                          <span className={statusBadgeClass(c.status)}>
                            {c.status}
                          </span>
                        </td>
                        <td className="max-w-[180px] border border-border px-3 py-2 text-xs text-muted">
                          {(c.audience_tags?.length ?? 0) > 0
                            ? c.audience_tags!.join(", ")
                            : "— (all)"}
                        </td>
                        <td className="border border-border px-3 py-2 text-xs tabular-nums text-muted">
                          {formatUtc(c.created_at)}
                        </td>
                        <td className="border border-border px-3 py-2 text-xs tabular-nums text-muted">
                          {c.sent_at
                            ? formatUtc(c.sent_at)
                            : c.scheduled_at
                              ? formatUtc(c.scheduled_at)
                              : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {open === "campaigns" && view === "list" ? (
              <ul className="space-y-2">
                {campaigns.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-lg border border-border bg-surface/40 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">
                        {c.subject}
                      </p>
                      <span className={statusBadgeClass(c.status)}>
                        {c.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Created {formatUtc(c.created_at)}
                      {c.sent_at
                        ? ` · Sent ${formatUtc(c.sent_at)}`
                        : c.scheduled_at
                          ? ` · Scheduled ${formatUtc(c.scheduled_at)}`
                          : ""}
                    </p>
                    {(c.audience_tags?.length ?? 0) > 0 ? (
                      <p className="mt-1 text-xs text-muted">
                        Tags: {c.audience_tags!.join(", ")}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted">
                        Audience: all subscribers
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
