import type { NewsletterAccess } from "@/lib/auth/newsletter-access";
import { normalizeNewsletterAccess } from "@/lib/auth/newsletter-access";
import { isNewsletterAccessColumnMissingError } from "@/lib/auth/profiles-column-compat";
import type { UserRole } from "@/lib/auth/roles";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { PostgrestError } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  newsletter_access: NewsletterAccess;
};

/** DB row before `normalizeNewsletterAccess` (column may be absent on older schemas). */
export type ProfileRowFromDb = Omit<Profile, "newsletter_access"> & {
  newsletter_access?: string | null;
};

export async function getProfileByUserId(
  userId: string
): Promise<Profile | null> {
  const supabase = getSupabaseAdmin();
  let data: ProfileRowFromDb | null = null;
  let error: PostgrestError | null = null;

  const primary = await supabase
    .from("profiles")
    .select("id, email, role, created_at, newsletter_access")
    .eq("id", userId)
    .maybeSingle();

  data = primary.data as ProfileRowFromDb | null;
  error = primary.error;

  if (error && isNewsletterAccessColumnMissingError(error)) {
    const fallback = await supabase
      .from("profiles")
      .select("id, email, role, created_at")
      .eq("id", userId)
      .maybeSingle();
    data = fallback.data as ProfileRowFromDb | null;
    error = fallback.error;
  }

  if (error || !data) return null;
  return {
    ...data,
    newsletter_access: normalizeNewsletterAccess(data.newsletter_access),
  };
}
