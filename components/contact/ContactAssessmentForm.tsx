"use client";

import { useActionState } from "react";
import {
  submitContactAssessment,
  type ContactAssessmentState,
} from "@/app/actions/contact-assessment";
import Button from "@/components/ui/Button";

const initial: ContactAssessmentState = { ok: false, message: "" };

export default function ContactAssessmentForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactAssessment,
    initial
  );

  return (
    <form
      action={formAction}
      className="relative rounded-[20px] border border-border bg-surface p-4 sm:p-6 lg:p-8"
    >
      <h3 className="text-xl font-bold">Request a free AI readiness call</h3>
      <p className="mt-2 text-sm text-muted">
        A short conversation with our team — not an automated report from the
        site. We’ll reply within one business day.
      </p>

      <div
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          type="text"
          id="company_website"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-1.5 block text-sm font-medium">
              First name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              autoComplete="given-name"
              disabled={isPending}
              className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-foreground disabled:opacity-60"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="mb-1.5 block text-sm font-medium">
              Last name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              autoComplete="family-name"
              disabled={isPending}
              className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-foreground disabled:opacity-60"
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isPending}
            className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-foreground disabled:opacity-60"
            placeholder="john@company.com"
          />
        </div>
        <div>
          <label htmlFor="company_role" className="mb-1.5 block text-sm font-medium">
            Company &amp; role
          </label>
          <input
            id="company_role"
            name="company_role"
            type="text"
            autoComplete="organization-title"
            disabled={isPending}
            className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-foreground disabled:opacity-60"
            placeholder="Acme Corp, VP of Operations"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
            Tell us about your supply chain challenges
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={isPending}
            className="w-full resize-none rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none transition-all focus:border-foreground disabled:opacity-60"
            placeholder="What are your biggest operational pain points? Which systems (SAP, Oracle, NetSuite) do you use?"
          />
        </div>
        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? "Sending…" : "Send request"}
        </Button>
        {state.message ? (
          <p
            className={`text-sm ${state.ok ? "text-primary" : "text-red-600"}`}
            role="status"
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
