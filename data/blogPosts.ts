/**
 * Blog content: primary store is Supabase `blog_posts` (see supabase/sql/blog_posts.sql).
 * Falls back to `content/blog/*.mdx` when the table is empty or unavailable.
 * Use `getAllPosts` / `getPostBySlug` from `@/lib/blog`.
 */
export type { BlogPostMeta as BlogPost } from "@/lib/blog";
