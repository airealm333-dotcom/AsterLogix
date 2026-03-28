import type { PostgrestError } from "@supabase/supabase-js";

/**
 * True when the query failed because `profiles.newsletter_access` is not in the
 * database (migration newsletter_editor_access.sql not applied yet).
 */
export function isNewsletterAccessColumnMissingError(
  err: PostgrestError | null | undefined
): boolean {
  if (!err) return false;
  const blob = `${err.message ?? ""} ${err.details ?? ""} ${err.hint ?? ""}`.toLowerCase();
  if (!blob.includes("newsletter_access")) return false;
  return (
    blob.includes("does not exist") ||
    blob.includes("undefined column") ||
    blob.includes("schema cache") ||
    err.code === "42703"
  );
}
