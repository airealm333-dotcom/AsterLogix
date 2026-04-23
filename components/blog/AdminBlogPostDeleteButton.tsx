"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteBlogPost } from "@/app/actions/blog-publish";

export default function AdminBlogPostDeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    if (
      !window.confirm(
        "Delete this post? It will be removed from the site and database. This cannot be undone."
      )
    ) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteBlogPost(slug);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        aria-label="Delete post"
        title="Delete post"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        )}
        <span className="sr-only">{pending ? "Deleting…" : "Delete"}</span>
      </button>
      {error ? (
        <span className="max-w-[12rem] text-[10px] leading-tight text-red-600" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
