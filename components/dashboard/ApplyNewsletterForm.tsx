"use client";

import { useActionState } from "react";
import { applyForNewsletter } from "@/app/actions/newsletter-application";
import Button from "@/components/ui/Button";

const initial = { ok: false, message: "" };

export default function ApplyNewsletterForm() {
  const [state, formAction, pending] = useActionState(applyForNewsletter, initial);

  if (state.ok) {
    return (
      <p className="rounded-xl border border-border bg-white p-4 text-sm text-foreground">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-border bg-white p-6">
      <div>
        <label htmlFor="nl-reason" className="block text-xs font-medium text-muted mb-1">
          Why do you want compose access? (min. 20 characters)
        </label>
        <textarea
          id="nl-reason"
          name="reason"
          required
          rows={5}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Describe how you will use newsletter campaigns…"
        />
      </div>
      <div>
        <label htmlFor="nl-portfolio" className="block text-xs font-medium text-muted mb-1">
          Optional link (portfolio, LinkedIn, etc.)
        </label>
        <input
          id="nl-portfolio"
          name="portfolio"
          type="url"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="https://…"
        />
      </div>
      {state.message ? (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
