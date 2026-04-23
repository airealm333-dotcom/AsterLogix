"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { publishBlogPost, updateBlogPost } from "@/app/actions/blog-publish";
import Button from "@/components/ui/Button";
import AdminBlogPostsList, {
  type AdminBlogPostRow,
} from "@/components/blog/AdminBlogPostsList";
import BlogCoverUpload from "@/components/blog/BlogCoverUpload";
import TiptapEditor from "@/components/blog/TiptapEditor";

const initial = { ok: false, message: "", issues: [] as string[] };

const labelClass = "text-xs font-medium text-foreground";
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
const cardClass =
  "rounded-xl border border-border/80 bg-white p-5 shadow-sm sm:p-6";

export type BlogPostForEdit = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  body_html: string;
};

export default function WriteBlogForm({
  dbPosts = [],
  initialPostForEdit = null,
  editNotFound = false,
}: {
  dbPosts?: AdminBlogPostRow[];
  initialPostForEdit?: BlogPostForEdit | null;
  editNotFound?: boolean;
}) {
  const router = useRouter();
  const isEditing = Boolean(initialPostForEdit);

  const [html, setHtml] = useState(
    () => initialPostForEdit?.body_html ?? "<p></p>"
  );
  const [coverUrl, setCoverUrl] = useState(
    () => initialPostForEdit?.image_url ?? ""
  );
  const [editorKey, setEditorKey] = useState(0);

  const [publishState, publishAction, publishPending] = useActionState(
    publishBlogPost,
    initial
  );
  const [updateState, updateAction, updatePending] = useActionState(
    updateBlogPost,
    initial
  );

  const formAction = isEditing ? updateAction : publishAction;
  const pending = isEditing ? updatePending : publishPending;
  const state = isEditing ? updateState : publishState;

  const lastPublishSuccess = useRef("");
  const lastUpdateSuccess = useRef("");

  useEffect(() => {
    if (!isEditing) {
      if (!publishState.ok || !publishState.message) return;
      if (lastPublishSuccess.current === publishState.message) return;
      lastPublishSuccess.current = publishState.message;
      setHtml("<p></p>");
      setCoverUrl("");
      setEditorKey((k) => k + 1);
      router.refresh();
      return;
    }

    if (!updateState.ok || !updateState.message) return;
    if (lastUpdateSuccess.current === updateState.message) return;
    lastUpdateSuccess.current = updateState.message;
    router.replace("/create/newsletter?tab=blog");
    router.refresh();
  }, [isEditing, publishState.ok, publishState.message, updateState.ok, updateState.message, router]);

  const cancelEdit = () => {
    router.replace("/create/newsletter?tab=blog");
  };

  return (
    <div className="mt-4 w-full space-y-8 px-3 sm:px-6 lg:px-10">
      {editNotFound ? (
        <div
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          <p className="font-medium">No post matches this edit link.</p>
          <p className="mt-1 text-xs text-amber-900/90">
            It may have been deleted, or the URL is wrong. You can still compose a
            new post below.
          </p>
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="body_html" value={html} />
        {isEditing && initialPostForEdit ? (
          <input
            type="hidden"
            name="original_slug"
            value={initialPostForEdit.slug}
          />
        ) : null}

        <div className={cardClass}>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Cover image
          </h3>
          <div className="mt-4">
            <BlogCoverUpload
              value={coverUrl}
              onChange={setCoverUrl}
              disabled={pending}
            />
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Post details
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="blog-title" className={labelClass}>
                Title
              </label>
              <input
                id="blog-title"
                name="title"
                required
                minLength={3}
                className={`${inputClass} mt-1.5`}
                placeholder="Clear, specific headline"
                defaultValue={initialPostForEdit?.title ?? ""}
                key={`title-${initialPostForEdit?.slug ?? "new"}`}
              />
            </div>
            <div>
              <label htmlFor="blog-slug" className={labelClass}>
                URL slug{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="blog-slug"
                name="slug"
                className={`${inputClass} mt-1.5 font-mono text-xs`}
                placeholder="auto-from-title"
                defaultValue={initialPostForEdit?.slug ?? ""}
                key={`slug-${initialPostForEdit?.slug ?? "new"}`}
              />
            </div>
            <div>
              <label htmlFor="blog-category" className={labelClass}>
                Category
              </label>
              <input
                id="blog-category"
                name="category"
                required
                minLength={2}
                className={`${inputClass} mt-1.5`}
                placeholder="e.g. Product, Company, Engineering"
                defaultValue={initialPostForEdit?.category ?? ""}
                key={`cat-${initialPostForEdit?.slug ?? "new"}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="blog-excerpt" className={labelClass}>
                Excerpt
              </label>
              <textarea
                id="blog-excerpt"
                name="excerpt"
                required
                minLength={24}
                maxLength={400}
                rows={4}
                className={`${inputClass} mt-1.5 min-h-[5rem] resize-y`}
                placeholder="One or two sentences: what the reader will learn."
                defaultValue={initialPostForEdit?.excerpt ?? ""}
                key={`ex-${initialPostForEdit?.slug ?? "new"}`}
              />
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Body
          </h3>
          <div className="mt-4">
            <TiptapEditor key={editorKey} value={html} onChange={setHtml} />
          </div>
        </div>

        {state.ok ? (
          <div
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            role="status"
          >
            <p className="font-medium">{state.message}</p>
          </div>
        ) : state.issues && state.issues.length > 0 ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="status"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-red-800">
              Fix the following
            </p>
            <ul className="mt-2 list-inside list-disc text-sm">
              {state.issues.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        ) : state.message ? (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="status"
          >
            <p className="font-medium">{state.message}</p>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted">
            {isEditing ? (
              <>
                Changes apply to <strong>/blog</strong> and the list below.
              </>
            ) : (
              <>
                Publishes immediately to <strong>/blog</strong> and this list
                below.
              </>
            )}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={pending}
                className="shrink-0 sm:min-w-[120px]"
              >
                Cancel editing
              </Button>
            ) : null}
            <Button
              type="submit"
              disabled={pending}
              className="shrink-0 sm:min-w-[180px]"
            >
              {pending
                ? isEditing
                  ? "Saving…"
                  : "Publishing…"
                : isEditing
                  ? "Save changes"
                  : "Publish live"}
            </Button>
          </div>
        </div>
      </form>

      <section aria-labelledby="dash-published-posts-heading" className="space-y-3">
        <h3
          id="dash-published-posts-heading"
          className="text-sm font-semibold text-foreground"
        >
          Posts in database
        </h3>
        <AdminBlogPostsList posts={dbPosts} />
      </section>
    </div>
  );
}
