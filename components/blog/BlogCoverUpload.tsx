"use client";

import { useCallback, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { prepareBlogCoverForUpload } from "@/lib/blog/cover-image-compress";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";

type Props = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export default function BlogCoverUpload({
  value,
  onChange,
  disabled,
}: Props) {
  const [phase, setPhase] = useState<"idle" | "optimizing" | "uploading">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const pickFile = useCallback(async () => {
    setError(null);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const maxOriginal = 20 * 1024 * 1024;
      if (file.size > maxOriginal) {
        setError("Image must be 20 MB or smaller before upload.");
        return;
      }
      setPhase("optimizing");
      try {
        let blob: Blob;
        let contentType: string;
        let filenameSuffix: string;

        const originalSuffix =
          file.name.match(/\.[a-z0-9]+$/i)?.[0] ||
          (file.type === "image/png"
            ? ".png"
            : file.type === "image/webp"
              ? ".webp"
              : file.type === "image/gif"
                ? ".gif"
                : ".jpg");

        if (file.size <= MAX_UPLOAD_BYTES) {
          /** Original bytes — no resize/re-encode when already within API limit. */
          blob = file;
          contentType = file.type || "application/octet-stream";
          filenameSuffix = originalSuffix;
        } else {
          try {
            const prep = await prepareBlogCoverForUpload(file);
            blob = prep.blob;
            contentType = prep.contentType;
            filenameSuffix = prep.filenameSuffix;
          } catch {
            setError(
              "Could not process this image and the file is over 8 MB. Try another format or a smaller file."
            );
            setPhase("idle");
            return;
          }
        }

        if (blob.size > MAX_UPLOAD_BYTES) {
          setError(
            "File is over 8 MB after preparation. Try a smaller or more compressed image."
          );
          setPhase("idle");
          return;
        }

        setPhase("uploading");
        const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const base = safe.replace(/\.[^/.]+$/, "") || "cover";
        const uploadName = `${base}${filenameSuffix}`;
        const fd = new FormData();
        fd.append(
          "file",
          new File([blob], uploadName, { type: contentType })
        );

        const res = await fetch("/api/blog/upload-cover", {
          method: "POST",
          body: fd,
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          url?: string;
        };
        if (!res.ok) {
          setError(data.error || `Upload failed (${res.status}).`);
          setPhase("idle");
          return;
        }
        if (!data.url) {
          setError("Upload succeeded but no URL was returned.");
          setPhase("idle");
          return;
        }
        onChange(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setPhase("idle");
      }
    };
    input.click();
  }, [onChange]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-border bg-surface shadow-inner">
          {value.trim() ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin preview URLs
            <img
              src={value}
              alt="Cover preview"
              className="max-h-[min(70vh,560px)] w-auto max-w-full object-contain"
            />
          ) : (
            <div className="flex min-h-[9rem] w-full items-center justify-center text-muted">
              <ImageIcon className="h-10 w-10 opacity-40" aria-hidden />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <button
            type="button"
            onClick={pickFile}
            disabled={disabled || phase !== "idle"}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-surface disabled:opacity-50"
          >
            {phase !== "idle" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Upload className="h-4 w-4" aria-hidden />
            )}
            {phase === "optimizing"
              ? "Preparing image…"
              : phase === "uploading"
                ? "Uploading…"
                : "Upload cover image"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="blog-image-url" className="sr-only">
          Cover image URL
        </label>
        <input
          id="blog-image-url"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClass}
          placeholder="https://…"
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="image_url" value={value} readOnly />

      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
