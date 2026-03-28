import type { ReactNode } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  getAllPosts as getAllPostsFromMdx,
  getBlogSlugs as getBlogSlugsFromMdx,
  getPostBySlug as getPostBySlugFromMdx,
} from "@/lib/mdx";

const metaSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  publishedAt: z.string(),
  image: z.string(),
  excerpt: z.string(),
});

export type BlogPostMeta = z.infer<typeof metaSchema>;

type BlogRow = {
  slug: string;
  title: string;
  category: string;
  date_display: string;
  published_at: string;
  image_url: string;
  excerpt: string;
  body_markdown: string;
  body_html?: string | null;
  author_id?: string | null;
};

export type BlogPostContent =
  | { format: "mdx"; node: ReactNode }
  | { format: "html"; html: string };

export type BlogPostResult = {
  meta: BlogPostMeta;
  body: BlogPostContent;
};

function rowToMeta(row: BlogRow): BlogPostMeta {
  return metaSchema.parse({
    title: row.title,
    slug: row.slug,
    category: row.category,
    date: row.date_display,
    publishedAt: row.published_at.slice(0, 10),
    image: row.image_url,
    excerpt: row.excerpt,
  });
}

/** Legacy fetch when RPC missing — includes author_id for filter */
async function fetchPublishedLegacyFallback(): Promise<BlogRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, category, date_display, published_at, image_url, excerpt, body_markdown, body_html, author_id"
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    if (
      error.code === "PGRST205" ||
      (error.message?.includes("relation") &&
        error.message?.includes("does not exist"))
    ) {
      return [];
    }
    throw error;
  }
  const { data: revoked, error: revErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "revoked_writer");
  if (revErr?.code === "PGRST205") {
    return (data ?? []) as BlogRow[];
  }
  const revokedIds = new Set((revoked ?? []).map((r) => r.id));
  return (data ?? []).filter(
    (r) => !r.author_id || !revokedIds.has(r.author_id)
  ) as BlogRow[];
}

async function fetchPublishedPostsUnified(): Promise<BlogRow[]> {
  const supabase = getSupabaseAdmin();
  const rpc = await supabase.rpc("list_published_blog_posts");
  if (!rpc.error && rpc.data && Array.isArray(rpc.data)) {
    return rpc.data as BlogRow[];
  }
  return fetchPublishedLegacyFallback();
}

async function fetchPostFromSupabase(slug: string): Promise<BlogRow | null> {
  const supabase = getSupabaseAdmin();
  const rpc = await supabase.rpc("get_published_blog_post", {
    p_slug: slug,
  });
  if (!rpc.error && rpc.data && Array.isArray(rpc.data) && rpc.data[0]) {
    return rpc.data[0] as BlogRow;
  }
  if (rpc.error && rpc.error.code !== "PGRST202") {
    /* function may not exist */
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, category, date_display, published_at, image_url, excerpt, body_markdown, body_html, author_id"
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    if (
      error.code === "PGRST205" ||
      (error.message?.includes("relation") &&
        error.message?.includes("does not exist"))
    ) {
      return null;
    }
    throw error;
  }
  if (!data) return null;
  const row = data as BlogRow & { author_id?: string | null };
  if (!row.author_id) return row as BlogRow;
  const { data: author } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", row.author_id)
    .maybeSingle();
  if (author?.role === "revoked_writer") return null;
  return row as BlogRow;
}

function canUseSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

async function rowToBlogPostResult(row: BlogRow): Promise<BlogPostResult> {
  const meta = rowToMeta(row);
  const html = row.body_html?.trim();
  if (html) {
    return { meta, body: { format: "html", html } };
  }
  const { content: mdxContent } = await compileMDX({
    source: row.body_markdown ?? "",
    options: { parseFrontmatter: false },
  });
  return { meta, body: { format: "mdx", node: mdxContent } };
}

/**
 * All posts for listing. Uses Supabase when the table has rows; otherwise MDX files in `content/blog`.
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const mdxPosts = await getAllPostsFromMdx();
  if (canUseSupabase()) {
    try {
      const rows = await fetchPublishedPostsUnified();
      if (rows.length > 0) {
        const supabasePosts = rows.map(rowToMeta);
        const bySlug = new Map<string, BlogPostMeta>();
        for (const p of supabasePosts) bySlug.set(p.slug, p);
        for (const p of mdxPosts) {
          if (!bySlug.has(p.slug)) bySlug.set(p.slug, p);
        }
        return Array.from(bySlug.values()).sort((a, b) =>
          a.publishedAt < b.publishedAt ? 1 : -1
        );
      }
    } catch (e) {
      console.warn("[blog] Supabase fetch failed, falling back to MDX:", e);
    }
  }
  return mdxPosts;
}

export async function getBlogSlugs(): Promise<string[]> {
  if (canUseSupabase()) {
    try {
      const rows = await fetchPublishedPostsUnified();
      if (rows.length > 0) {
        return rows.map((r) => r.slug);
      }
    } catch (e) {
      console.warn("[blog] Supabase slugs failed, falling back to MDX:", e);
    }
  }
  return getBlogSlugsFromMdx();
}

/**
 * Single post with MDX or sanitized HTML body.
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostResult | null> {
  if (canUseSupabase()) {
    try {
      const row = await fetchPostFromSupabase(slug);
      if (row) {
        return rowToBlogPostResult(row);
      }
    } catch (e) {
      console.warn("[blog] Supabase post fetch failed, trying MDX:", e);
    }
  }
  const mdx = await getPostBySlugFromMdx(slug);
  if (!mdx) return null;
  return {
    meta: mdx.meta,
    body: { format: "mdx", node: mdx.content },
  };
}
