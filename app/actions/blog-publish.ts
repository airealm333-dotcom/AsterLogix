"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasMeaningfulBlogBody } from "@/lib/blog/body-validation";
import { isAdmin } from "@/lib/auth/roles";
import { slugifyTitle } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

const publishSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters."),
    category: z
      .string()
      .trim()
      .min(2, "Category is required (e.g. Product, Company)."),
    excerpt: z
      .string()
      .trim()
      .min(24, "Excerpt should be at least 24 characters for blog cards."),
    image_url: z
      .string()
      .trim()
      .min(1, "Upload a cover image or paste an https image URL."),
    body_html: z.string(),
    slug: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.excerpt.length > 400) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Excerpt must be 400 characters or fewer.",
        path: ["excerpt"],
      });
    }
    const u = data.image_url.trim();
    if (!/^https:\/\//i.test(u)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cover image must be an https:// URL (upload generates one).",
        path: ["image_url"],
      });
    }
    if (!hasMeaningfulBlogBody(data.body_html, 30)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Body needs real content — at least ~30 characters of text (not only empty paragraphs).",
        path: ["body_html"],
      });
    }
  });

export async function publishBlogPost(
  _prev: { ok: boolean; message: string; issues?: string[] },
  formData: FormData
): Promise<{ ok: boolean; message: string; issues?: string[] }> {
  const rawSlug = formData.get("slug");
  const parsed = publishSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    image_url: formData.get("image_url"),
    body_html: formData.get("body_html"),
    slug:
      typeof rawSlug === "string" && rawSlug.trim()
        ? rawSlug.trim()
        : undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message);
    return {
      ok: false,
      message: issues[0] ?? "Invalid input",
      issues,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in required.", issues: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!isAdmin(profile?.role)) {
    return {
      ok: false,
      message: "You don’t have permission to publish.",
      issues: [],
    };
  }

  const slug =
    parsed.data.slug && parsed.data.slug.length > 0
      ? slugifyTitle(parsed.data.slug)
      : slugifyTitle(parsed.data.title);

  if (!slug) {
    return {
      ok: false,
      message: "Could not derive a URL slug from the title.",
      issues: [],
    };
  }

  const today = new Date();
  const published_at = today.toISOString().slice(0, 10);
  const date_display = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      message: "That slug is already in use. Change the title or slug.",
      issues: [],
    };
  }

  const imageUrl = parsed.data.image_url;

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    title: parsed.data.title,
    category: parsed.data.category,
    date_display,
    published_at,
    image_url: imageUrl,
    excerpt: parsed.data.excerpt,
    body_markdown: "",
    body_html: parsed.data.body_html,
    published: true,
    author_id: user.id,
  });

  if (error) {
    console.error(error);
    const hint =
      error.code === "42501" || /permission denied|rls/i.test(error.message)
        ? " Database blocked the insert. If you use split admin RLS, run supabase/sql/blog_posts_admin_insert.sql in Supabase."
        : "";
    return {
      ok: false,
      message:
        (error.message.includes("blog_posts")
          ? error.message
          : "Could not publish. Check blog_posts columns (author_id, body_html).") + hint,
      issues: [],
    };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/");
  revalidatePath("/create/newsletter");

  return {
    ok: true,
    message: `Published — open /blog/${slug}`,
    issues: [],
  };
}

async function requireAdminSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function updateBlogPost(
  _prev: { ok: boolean; message: string; issues?: string[] },
  formData: FormData
): Promise<{ ok: boolean; message: string; issues?: string[] }> {
  const rawOriginal = formData.get("original_slug");
  const originalSlug =
    typeof rawOriginal === "string" ? rawOriginal.trim() : "";
  if (!originalSlug) {
    return {
      ok: false,
      message: "Missing post to update.",
      issues: [],
    };
  }

  const rawSlug = formData.get("slug");
  const parsed = publishSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    excerpt: formData.get("excerpt"),
    image_url: formData.get("image_url"),
    body_html: formData.get("body_html"),
    slug:
      typeof rawSlug === "string" && rawSlug.trim()
        ? rawSlug.trim()
        : undefined,
  });

  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message);
    return {
      ok: false,
      message: issues[0] ?? "Invalid input",
      issues,
    };
  }

  const { supabase, user, profile } = await requireAdminSupabase();
  if (!user) return { ok: false, message: "Sign in required.", issues: [] };

  if (!isAdmin(profile?.role)) {
    return {
      ok: false,
      message: "You don’t have permission to update posts.",
      issues: [],
    };
  }

  const newSlug =
    parsed.data.slug && parsed.data.slug.length > 0
      ? slugifyTitle(parsed.data.slug)
      : slugifyTitle(parsed.data.title);

  if (!newSlug) {
    return {
      ok: false,
      message: "Could not derive a URL slug from the title.",
      issues: [],
    };
  }

  const { data: existing, error: fetchErr } = await supabase
    .from("blog_posts")
    .select("id, slug, published_at, date_display")
    .eq("slug", originalSlug)
    .maybeSingle();

  if (fetchErr) {
    console.error(fetchErr);
    return {
      ok: false,
      message: "Could not load the post to update.",
      issues: [],
    };
  }

  if (!existing) {
    return {
      ok: false,
      message: "That post no longer exists or you can’t edit it.",
      issues: [],
    };
  }

  if (newSlug !== originalSlug) {
    const { data: conflict } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", newSlug)
      .maybeSingle();

    if (conflict && conflict.id !== existing.id) {
      return {
        ok: false,
        message: "That slug is already in use. Change the title or slug.",
        issues: [],
      };
    }
  }

  const imageUrl = parsed.data.image_url;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      slug: newSlug,
      title: parsed.data.title,
      category: parsed.data.category,
      excerpt: parsed.data.excerpt,
      image_url: imageUrl,
      body_html: parsed.data.body_html,
      published_at: existing.published_at,
      date_display: existing.date_display,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (error) {
    console.error(error);
    const hint =
      error.code === "42501" || /permission denied|rls/i.test(error.message)
        ? " Database blocked the update. Check admin UPDATE policy on blog_posts."
        : "";
    return {
      ok: false,
      message:
        (error.message.includes("blog_posts")
          ? error.message
          : "Could not save changes.") + hint,
      issues: [],
    };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${originalSlug}`);
  if (newSlug !== originalSlug) {
    revalidatePath(`/blog/${newSlug}`);
  }
  revalidatePath("/");
  revalidatePath("/create/newsletter");

  return {
    ok: true,
    message: `Saved — open /blog/${newSlug}`,
    issues: [],
  };
}

export async function deleteBlogPost(
  slug: string
): Promise<{ ok: boolean; message: string }> {
  const trimmed = slug.trim();
  if (!trimmed) {
    return { ok: false, message: "Missing slug." };
  }

  const { supabase, user, profile } = await requireAdminSupabase();
  if (!user) return { ok: false, message: "Sign in required." };

  if (!isAdmin(profile?.role)) {
    return { ok: false, message: "You don’t have permission to delete posts." };
  }

  const { error } = await supabase.from("blog_posts").delete().eq("slug", trimmed);

  if (error) {
    console.error(error);
    const hint =
      error.code === "42501" || /permission denied|rls/i.test(error.message)
        ? " Database blocked the delete. Check admin DELETE policy on blog_posts."
        : "";
    return {
      ok: false,
      message:
        (error.message.includes("blog_posts")
          ? error.message
          : "Could not delete the post.") + hint,
    };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${trimmed}`);
  revalidatePath("/");
  revalidatePath("/create/newsletter");

  return { ok: true, message: "Post deleted." };
}
