import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import WriteBlogForm from "@/components/blog/WriteBlogForm";
import AdminDashboardTabs from "@/components/dashboard/AdminDashboardTabs";
import AdminOverviewMetrics from "@/components/dashboard/AdminOverviewMetrics";
import {
  parseDashboardTab,
  type AdminDashboardTabId,
} from "@/lib/dashboard-tabs";
import NewsletterCompose from "@/components/dashboard/NewsletterCompose";
import SubscribersTablePanel from "@/components/dashboard/SubscribersTablePanel";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Create newsletter — Experidium",
};

const PAGE_SIZE = 10;

type DashboardSearchParams = Record<
  string,
  string | string[] | undefined
>;

function searchParamFirst(
  value: string | string[] | undefined
): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function subscribersQuery(page: number, tab: AdminDashboardTabId) {
  const query = new URLSearchParams();
  if (tab !== "newsletter") query.set("tab", tab);
  if (page > 1) query.set("page", String(page));
  const q = query.toString();
  return q ? `?${q}` : "";
}

export default async function CreateNewsletterPage(props: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const sp = await props.searchParams;
  const tab = parseDashboardTab(sp.tab);
  const page = Math.max(
    1,
    parseInt(searchParamFirst(sp.page) ?? "1", 10) || 1
  );
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const [
    subscribersRes,
    subscribersAllRes,
    campaignsRes,
    allPosts,
    adminBlogRes,
  ] = await Promise.all([
    supabase
      .from("subscribers")
      .select("id, email, tags, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("subscribers")
      .select("id, email, tags, created_at")
      .order("created_at", { ascending: false })
      .limit(2000),
    supabase
      .from("newsletter_campaigns")
      .select(
        "id, subject, status, created_at, sent_at, scheduled_at, audience_tags"
      )
      .order("created_at", { ascending: false }),
    getAllPosts(),
    supabase
      .from("blog_posts")
      .select("slug, title, category, published_at, published")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const rows = subscribersRes.data ?? [];
  const count = subscribersRes.count ?? 0;
  const subscriberError = subscribersRes.error;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  const campaigns = campaignsRes.data ?? [];
  const overviewSubscriberRows = (subscribersAllRes.data ?? []).map((row) => ({
    id: String(row.id),
    email: String(row.email ?? ""),
    tags: (row.tags as string[]) ?? [],
    created_at: (row.created_at as string) ?? null,
  }));
  const campaignRows = campaigns.map((c) => ({
    id: String(c.id),
    subject: String(c.subject ?? ""),
    status: String(c.status ?? ""),
    created_at: (c.created_at as string) ?? null,
    sent_at: (c.sent_at as string) ?? null,
    scheduled_at: (c.scheduled_at as string) ?? null,
    audience_tags: (c.audience_tags as string[] | null) ?? null,
  }));
  const blogRows = allPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    publishedAt: p.publishedAt,
  }));

  const dbPostsForAdmin = (adminBlogRes.data ?? []).map((r) => ({
    slug: String(r.slug),
    title: String(r.title ?? ""),
    category: String(r.category ?? ""),
    published_at:
      r.published_at == null
        ? ""
        : typeof r.published_at === "string"
          ? r.published_at.slice(0, 10)
          : String(r.published_at).slice(0, 10),
    published: Boolean(r.published),
  }));

  const panels: Record<AdminDashboardTabId, ReactNode> = {
    newsletter: (
      <section aria-labelledby="dash-heading-newsletter">
        <h2
          id="dash-heading-newsletter"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Newsletter — compose and send
        </h2>
        <div className="mt-3">
          <NewsletterCompose subscriberCount={count} />
        </div>
      </section>
    ),
    blog: (
      <section aria-labelledby="dash-heading-blog">
        <h2
          id="dash-heading-blog"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Publish blog post
        </h2>
        <div className="mt-3">
          <WriteBlogForm dbPosts={dbPostsForAdmin} />
        </div>
      </section>
    ),
    subscribers: (
      <SubscribersTablePanel
        rows={rows.map((row) => ({
          id: String(row.id),
          email: String(row.email ?? ""),
          tags: (row.tags as string[]) ?? [],
          created_at: (row.created_at as string) ?? null,
        }))}
        errorMessage={subscriberError?.message ?? null}
        page={page}
        totalPages={totalPages}
        count={count}
        prevHref={
          page > 1
            ? `/create/newsletter${subscribersQuery(page - 1, "subscribers")}`
            : null
        }
        nextHref={
          page < totalPages
            ? `/create/newsletter${subscribersQuery(page + 1, "subscribers")}`
            : null
        }
      />
    ),
  };

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <header className="mt-4 flex flex-col gap-4 border-b border-border pb-8 sm:mt-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Compose newsletters, publish blog posts, and manage subscribers
              from one place.
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 self-start rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background"
          >
            Back to site
          </Link>
        </header>

        <AdminOverviewMetrics
          subscriberRows={overviewSubscriberRows}
          subscriberCount={count}
          campaigns={campaignRows}
          blogs={blogRows}
        />

        <Suspense
          fallback={
            <div className="mt-8 text-sm text-muted">Loading dashboard…</div>
          }
        >
          <AdminDashboardTabs defaultTab={tab} panels={panels} />
        </Suspense>
      </div>
    </main>
  );
}
