/**
 * One-time: copy posts from content/blog/*.mdx into Supabase blog_posts.
 *
 * Prerequisites:
 * 1. Run supabase/sql/blog_posts.sql in the Supabase SQL editor.
 * 2. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Run: npm run seed:blog
 */
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

config({ path: path.resolve(process.cwd(), ".env.local") });
config();

const root = process.cwd();
const blogDir = path.join(root, "content", "blog");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  if (!fs.existsSync(blogDir)) {
    console.error("No content/blog directory found.");
    process.exit(1);
  }

  let authorId: string | null = null;
  const { data: adminProfile, error: profErr } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();
  if (!profErr && adminProfile?.id) {
    authorId = adminProfile.id;
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    const d = data as Record<string, string>;

    const slug = d.slug ?? file.replace(/\.mdx$/, "");
    const publishedAt = d.publishedAt?.slice(0, 10) ?? "2026-01-01";

    const row = {
      slug,
      title: d.title,
      category: d.category,
      date_display: d.date,
      published_at: publishedAt,
      image_url: d.image,
      excerpt: d.excerpt,
      body_markdown: content.trim(),
      body_html: null,
      published: true,
      ...(authorId ? { author_id: authorId } : {}),
    };

    const { error } = await supabase.from("blog_posts").upsert(row, {
      onConflict: "slug",
    });

    if (error) {
      console.error("Upsert failed:", slug, error.message);
      process.exit(1);
    }
    console.log("Seeded:", slug);
  }

  console.log("\nDone. Site will prefer Supabase posts when the table has rows.");
  console.log(
    "Optional: rename content/blog → content/blog-archived to avoid confusion."
  );
}

main();
