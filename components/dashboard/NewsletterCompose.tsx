"use client";

import { useActionState, useState } from "react";
import { createNewsletterCampaign } from "@/app/actions/newsletter-dashboard";
import Button from "@/components/ui/Button";

const initial = { ok: false, message: "" };

const labelClass = "text-xs font-medium text-foreground";
const inputClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground shadow-sm transition-shadow focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25";
const textareaClass = `${inputClass} font-mono leading-relaxed`;
const cardClass =
  "rounded-lg border border-border/80 bg-surface/80 p-4";

export default function NewsletterCompose({
  subscriberCount,
}: {
  subscriberCount: number;
}) {
  const [mode, setMode] = useState<"now" | "schedule">("now");
  const [state, formAction, pending] = useActionState(
    createNewsletterCampaign,
    initial
  );

  return (
    <div className="w-full">
      <form
        action={formAction}
        className="mt-4 space-y-5 px-3 sm:px-6 lg:px-10"
        onSubmit={(e) => {
          const form = e.currentTarget;
          const hidden = form.elements.namedItem(
            "scheduled_at"
          ) as HTMLInputElement | null;
          const local = form.elements.namedItem(
            "scheduled_at_local"
          ) as HTMLInputElement | null;
          if (hidden) {
            if (mode === "schedule" && local?.value) {
              hidden.value = new Date(local.value).toISOString();
            } else {
              hidden.value = "";
            }
          }
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5 lg:items-stretch">
          <div className={cardClass}>
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Audience
            </h3>
            <p className="mt-1.5 text-xs text-muted">
              <span className="font-semibold tabular-nums text-foreground">
                {subscriberCount}
              </span>{" "}
              in list
            </p>
            <div className="mt-3">
              <label htmlFor="audience_tags" className={labelClass}>
                Tags filter{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="audience_tags"
                name="audience_tags"
                type="text"
                className={`${inputClass} mt-1.5`}
                placeholder="Comma-separated — any match; empty = all"
                autoComplete="off"
                title="Subscribers must have at least one of these tags. Edit tags on the Subscribers tab."
              />
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Schedule
            </h3>
            <p className="mt-1.5 text-xs text-muted">
              Your local date &amp; time (stored as UTC). Scheduled sends need{" "}
              <code className="rounded bg-muted/60 px-1 text-[10px]">
                /api/cron/dispatch-newsletter
              </code>{" "}
              on a timer (Vercel Cron or external); see README.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label
                className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  mode === "now"
                    ? "border-primary bg-primary-light/35 text-foreground"
                    : "border-border bg-white text-muted hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="campaign_mode"
                  value="now"
                  checked={mode === "now"}
                  onChange={() => setMode("now")}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Send now</span>
              </label>
              <label
                className={`flex flex-1 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                  mode === "schedule"
                    ? "border-primary bg-primary-light/35 text-foreground"
                    : "border-border bg-white text-muted hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="campaign_mode"
                  value="schedule"
                  checked={mode === "schedule"}
                  onChange={() => setMode("schedule")}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Later</span>
              </label>
            </div>
            {mode === "schedule" ? (
              <div className="mt-3">
                <label htmlFor="scheduled_at_local" className={labelClass}>
                  Date &amp; time
                </label>
                <input type="hidden" name="scheduled_at" defaultValue="" />
                <input
                  id="scheduled_at_local"
                  type="datetime-local"
                  name="scheduled_at_local"
                  required={mode === "schedule"}
                  className={`${inputClass} mt-1.5 w-full max-w-full sm:max-w-md`}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className={cardClass}>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Content
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                required
                className={`${inputClass} mt-1.5`}
                placeholder="Inbox subject line"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="preheader" className={labelClass}>
                Preview <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="preheader"
                name="preheader"
                type="text"
                className={`${inputClass} mt-1.5`}
                placeholder="Shown beside subject in many clients"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="html_body" className={labelClass}>
                HTML body
              </label>
              <p className="mt-0.5 text-[11px] text-muted">
                Inner HTML only — branded header, footer, and preview line are added on send. Use inline{" "}
                <code className="rounded bg-muted/50 px-1">style=</code> on headings and links for best results in email clients.
              </p>
              <textarea
                id="html_body"
                name="html_body"
                required
                rows={12}
                className={`${textareaClass} mt-1.5 min-h-[200px]`}
                placeholder={`<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi — quick update from us.</p>
<h2 style="margin:24px 0 12px;font-size:20px;color:#18181b;">This week</h2>
<p style="margin:0 0 12px;font-size:16px;line-height:1.65;">Your story here. <a href="#" style="color:#3f6212;font-weight:600;">Read more</a></p>`}
              />
            </div>
          </div>
        </div>

        {state.message ? (
          <p
            className={
              state.ok ? "text-sm text-green-700" : "text-sm text-red-600"
            }
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-muted">
            {mode === "now"
              ? "Sends to everyone matching the tag filter (or all if empty)."
              : "Saved as scheduled; cron runs dispatch at the chosen time."}
          </p>
          <Button
            type="submit"
            disabled={pending}
            className="shrink-0 sm:min-w-[180px]"
          >
            {pending
              ? "Working…"
              : mode === "now"
                ? "Send campaign"
                : "Save scheduled"}
          </Button>
        </div>
      </form>
    </div>
  );
}
