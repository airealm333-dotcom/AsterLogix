const COOKIE = "sb_auth_next";
const MAX_AGE_SEC = 600;

/** Call before OAuth redirect. Server reads this in /auth/callback. */
export function setAuthReturnPathClient(path: string): void {
  if (typeof document === "undefined") return;
  const p = path.startsWith("/") ? path : `/${path}`;
  const v = encodeURIComponent(p);
  document.cookie = `${COOKIE}=${v}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax`;
}

export const AUTH_RETURN_COOKIE = COOKIE;
