import Link from "next/link";
import { ExternalLink } from "lucide-react";

export type AdminBlogPostRow = {
  slug: string;
  title: string;
  category: string;
  published_at: string;
  published: boolean;
};

export default function AdminBlogPostsList({
  posts,
}: {
  posts: AdminBlogPostRow[];
}) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-8 text-center text-sm text-muted">
        No posts in the database yet. Publish one above — it will show up here and on{" "}
        <Link href="/blog" className="font-medium text-primary hover:underline">
          /blog
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-surface/70 text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <th className="border border-border px-3 py-2.5">Title</th>
            <th className="border border-border px-3 py-2.5">Category</th>
            <th className="border border-border px-3 py-2.5">Published</th>
            <th className="border border-border px-3 py-2.5">Status</th>
            <th className="border border-border px-3 py-2.5">Open</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr
              key={p.slug}
              className="border-b border-border odd:bg-white even:bg-surface/30"
            >
              <td className="border border-border px-3 py-2.5 font-medium text-foreground">
                {p.title}
              </td>
              <td className="border border-border px-3 py-2.5 text-muted">
                {p.category}
              </td>
              <td className="border border-border px-3 py-2.5 text-xs tabular-nums text-muted">
                {p.published_at}
              </td>
              <td className="border border-border px-3 py-2.5">
                <span
                  className={
                    p.published
                      ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                      : "inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600"
                  }
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </td>
              <td className="border border-border px-3 py-2.5">
                {p.published ? (
                  <Link
                    href={`/blog/${p.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </Link>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
