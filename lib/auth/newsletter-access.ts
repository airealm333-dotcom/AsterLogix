export type NewsletterAccess = "none" | "pending" | "editor";

export function normalizeNewsletterAccess(
  value: string | null | undefined
): NewsletterAccess {
  if (value === "pending" || value === "editor") return value;
  return "none";
}

/** Newsletter compose and sends are admin-only; `newsletter_access` is ignored. */
export function canComposeNewsletter(params: {
  role: string;
  newsletter_access?: NewsletterAccess;
}): boolean {
  return params.role === "admin";
}
