import fs from "fs";
import path from "path";
import type { ReactNode } from "react";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { z } from "zod";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  category: z.string(),
  date: z.string(),
  publishedAt: z.string(),
  image: z.string(),
  excerpt: z.string(),
});

export type BlogPostMeta = z.infer<typeof frontmatterSchema>;

function parseFrontmatter(data: unknown): BlogPostMeta {
  return frontmatterSchema.parse(data);
}

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const slugs = getBlogSlugs();
  const posts: BlogPostMeta[] = [];

  for (const slug of slugs) {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    try {
      posts.push(parseFrontmatter({ ...data, slug: (data as { slug?: string }).slug ?? slug }));
    } catch {
      console.warn("Invalid frontmatter for", slug);
    }
  }

  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(
  slug: string
): Promise<{ meta: BlogPostMeta; content: ReactNode } | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const meta = parseFrontmatter({ ...data, slug: (data as { slug?: string }).slug ?? slug });

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
  });

  return { meta, content: mdxContent };
}
