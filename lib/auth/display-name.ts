import type { User } from "@supabase/supabase-js";

/**
 * Friendly label for the signed-in user: OAuth name fields first, then email local-part.
 */
export function displayNameFromAuthUser(user: User): string {
  const m = user.user_metadata ?? {};
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = m[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return null;
  };

  const fromMeta =
    pick(
      "full_name",
      "name",
      "display_name",
      "preferred_username",
      "user_name",
      "username",
      "nickname"
    ) ?? null;

  if (fromMeta) return fromMeta;

  const email = user.email?.trim();
  if (email?.includes("@")) {
    const local = email.split("@")[0];
    if (local) return local;
  }
  if (email) return email;

  return "Member";
}
