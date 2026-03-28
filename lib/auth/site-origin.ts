/**
 * OAuth and email confirmation redirects must match Supabase
 * Authentication → URL Configuration → Redirect URLs exactly
 * (e.g. http://localhost:3000/auth/callback or a wildcard).
 *
 * Set NEXT_PUBLIC_SITE_URL if you use 127.0.0.1 vs localhost — it must match
 * what you open in the browser and what you allowlisted.
 */
export function getBrowserSiteOrigin(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (env) return env;
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}
