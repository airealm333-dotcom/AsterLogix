import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Secret for HMAC signing unsubscribe links.
 * Falls back to CRON_SECRET so one secret can serve cron + unsubscribe if desired.
 */
export function getNewsletterUnsubscribeSecret(): string | null {
  const a = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET?.trim();
  const b = process.env.CRON_SECRET?.trim();
  return a || b || null;
}

function emailToTokenPayload(email: string): string {
  return email.trim().toLowerCase();
}

export function signNewsletterUnsubscribeEmail(email: string): {
  e: string;
  s: string;
} {
  const secret = getNewsletterUnsubscribeSecret();
  if (!secret) throw new Error("Missing NEWSLETTER_UNSUBSCRIBE_SECRET or CRON_SECRET");
  const normalized = emailToTokenPayload(email);
  const e = Buffer.from(normalized, "utf8").toString("base64url");
  const s = createHmac("sha256", secret).update(normalized).digest("hex");
  return { e, s };
}

/** Returns normalized email if signature is valid, else null. */
export function verifyNewsletterUnsubscribeParams(
  e: string | null,
  s: string | null
): string | null {
  if (!e || !s) return null;
  const secret = getNewsletterUnsubscribeSecret();
  if (!secret) return null;
  if (!/^[a-f0-9]{64}$/i.test(s)) return null;

  let normalized: string;
  try {
    normalized = Buffer.from(e, "base64url").toString("utf8").trim().toLowerCase();
  } catch {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;

  const expectedHex = createHmac("sha256", secret)
    .update(normalized)
    .digest("hex");
  const a = Buffer.from(expectedHex, "hex");
  const b = Buffer.from(s.toLowerCase(), "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return normalized;
}

export function buildNewsletterOneClickUnsubscribeUrl(
  siteUrl: string,
  email: string
): string | null {
  const secret = getNewsletterUnsubscribeSecret();
  if (!secret) return null;
  const base = siteUrl.replace(/\/$/, "");
  const { e, s } = signNewsletterUnsubscribeEmail(email);
  const u = new URL(`${base}/api/newsletter/unsubscribe`);
  u.searchParams.set("e", e);
  u.searchParams.set("s", s);
  return u.toString();
}
