import { Resend } from "resend";

let resendClient: Resend | null = null;

/** Subscriber-facing mail (campaigns, subscribe welcome). */
export type ResendMailPurposeNewsletter = "newsletter";

/** Transactional mail (contact forms, system emails, alerts). */
export type ResendMailPurposeContact = "contact";

export type ResendMailPurpose =
  | ResendMailPurposeNewsletter
  | ResendMailPurposeContact;

/**
 * From address for Resend sends.
 * - `newsletter`: `RESEND_NEWSLETTER_FROM`, else `RESEND_FROM_EMAIL` (e.g. `Experidium <newsletter@experidium.online>`)
 * - `contact`: `RESEND_FROM_EMAIL` only (e.g. `Experidium <contact@experidium.online>`)
 */
export function getResendFromEmail(purpose: ResendMailPurpose): string {
  if (purpose === "newsletter") {
    const newsletter = process.env.RESEND_NEWSLETTER_FROM?.trim();
    if (newsletter) return newsletter;
  }
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) {
    throw new Error(
      purpose === "newsletter"
        ? "Set RESEND_NEWSLETTER_FROM or RESEND_FROM_EMAIL in environment."
        : "Set RESEND_FROM_EMAIL in environment."
    );
  }
  return from;
}

/** Alias for `getResendFromEmail` (plan / docs). */
export const getFromEmail = getResendFromEmail;

/** True when transactional email can be sent. */
export function isResendContactMailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim()
  );
}

/** True when subscriber-facing email can be sent (dedicated newsletter from or fallback). */
export function isResendNewsletterMailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      (process.env.RESEND_NEWSLETTER_FROM?.trim() ||
        process.env.RESEND_FROM_EMAIL?.trim())
  );
}

/**
 * True when Resend can send transactional email from `RESEND_FROM_EMAIL`.
 * Prefer `isResendContactMailConfigured` / `isResendNewsletterMailConfigured` for clarity.
 */
export function isResendConfigured(): boolean {
  return isResendContactMailConfigured();
}

/**
 * Server-only Resend client.
 * Set `RESEND_API_KEY` and from-address env vars in `.env.local`.
 */
export function getResend(): Resend {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment.");
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}
