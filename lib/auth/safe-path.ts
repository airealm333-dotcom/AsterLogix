/** Same rules as server callback: internal path only, no protocol-relative URLs. */
export function safeClientRedirectPath(
  raw: string | null | undefined,
  fallback = "/"
): string {
  const p = raw?.trim();
  if (!p || !p.startsWith("/") || p.startsWith("//")) return fallback;
  return p;
}
