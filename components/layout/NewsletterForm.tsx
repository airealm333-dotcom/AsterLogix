"use client";

import { useActionState, useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";

const initial: SubscribeState = { ok: false, message: "" };

export default function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribe, initial);
  const lastTrackedMessage = useRef("");

  useEffect(() => {
    if (!state.ok || !state.message) return;
    if (lastTrackedMessage.current === state.message) return;
    lastTrackedMessage.current = state.message;
    track("newsletter_subscribe", { source: "footer" });
  }, [state.ok, state.message]);

  return (
    <div className="mt-2 space-y-2">
      <form action={formAction} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email"
          disabled={isPending}
          className="min-w-0 flex-1 rounded-full bg-card-dark px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary-dark disabled:opacity-60 shrink-0"
        >
          {isPending ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {state.message ? (
        <p
          className={`text-xs ${state.ok ? "text-primary" : "text-red-300"}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
