import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminIfConfigured } from "@/lib/supabase/admin";
import { displayNameFromAuthUser } from "@/lib/auth/display-name";
import { normalizeNewsletterAccess } from "@/lib/auth/newsletter-access";
import type { Profile, ProfileRowFromDb } from "@/lib/auth/profile";
import type { UserRole } from "@/lib/auth/roles";
import { isNewsletterAccessColumnMissingError } from "@/lib/auth/profiles-column-compat";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

function formatPostgrestErr(err: PostgrestError): string {
  const code = err.code ?? "?";
  const msg = String(err.message || "").slice(0, 220);
  const details = err.details ? ` details=${String(err.details).slice(0, 100)}` : "";
  const hint = err.hint ? ` hint=${String(err.hint).slice(0, 100)}` : "";
  return `code=${code} msg=${msg}${details}${hint}`;
}

/** Dev-only; uses warn (not error) so Next.js does not treat it as a console error overlay. */
function logSessionProfileDev(
  message: string,
  err?: PostgrestError | null
): void {
  if (process.env.NODE_ENV !== "development") return;
  if (err) {
    console.warn(`[getSessionProfile] ${message} ${formatPostgrestErr(err)}`);
  } else {
    console.warn(`[getSessionProfile] ${message}`);
  }
}

/** PostgREST: table not exposed / not in schema cache */
function isProfilesRelationMissing(err: PostgrestError | null | undefined): boolean {
  if (!err) return false;
  if (err.code === "PGRST205") return true;
  const m = String(err.message || "").toLowerCase();
  return (
    m.includes("schema cache") || m.includes("could not find the table")
  );
}

function isProfilesRlsRecursion(err: PostgrestError | null | undefined): boolean {
  return String(err?.message || "")
    .toLowerCase()
    .includes("infinite recursion");
}

/** Prefer limit(1) over maybeSingle() to avoid PGRST116 edge cases. */
async function fetchProfileRow(
  supabase: SupabaseClient,
  userId: string
): Promise<{ profile: Profile | null; error: PostgrestError | null }> {
  let data: ProfileRowFromDb[] | null = null;
  let error: PostgrestError | null = null;

  const primary = await supabase
    .from("profiles")
    .select("id, email, role, created_at, newsletter_access")
    .eq("id", userId)
    .limit(1);

  data = primary.data as ProfileRowFromDb[] | null;
  error = primary.error;

  if (error && isNewsletterAccessColumnMissingError(error)) {
    logSessionProfileDev(
      "profiles.newsletter_access missing — run supabase/sql/newsletter_editor_access.sql; retrying without column",
      error
    );
    const fallback = await supabase
      .from("profiles")
      .select("id, email, role, created_at")
      .eq("id", userId)
      .limit(1);
    data = fallback.data as ProfileRowFromDb[] | null;
    error = fallback.error;
  }

  const row = data?.[0];
  if (!row) return { profile: null, error: error ?? null };
  const raw = row;
  return {
    profile: {
      ...raw,
      newsletter_access: normalizeNewsletterAccess(raw.newsletter_access),
    },
    error: error ?? null,
  };
}

async function ensureProfileViaRpc(supabase: SupabaseClient): Promise<void> {
  await supabase.rpc("ensure_my_profile");
}

async function ensureProfileViaServiceRole(
  userId: string,
  email: string
): Promise<Profile | null> {
  const admin = getSupabaseAdminIfConfigured();
  if (!admin) return null;

  let data: ProfileRowFromDb | null = null;
  let error: PostgrestError | null = null;

  const primary = await admin
    .from("profiles")
    .upsert(
      { id: userId, email: email || "", role: "user" },
      { onConflict: "id" }
    )
    .select("id, email, role, created_at, newsletter_access")
    .single();

  data = primary.data as ProfileRowFromDb | null;
  error = primary.error;

  if (error && isNewsletterAccessColumnMissingError(error)) {
    const fallback = await admin
      .from("profiles")
      .upsert(
        { id: userId, email: email || "", role: "user" },
        { onConflict: "id" }
      )
      .select("id, email, role, created_at")
      .single();
    data = fallback.data as ProfileRowFromDb | null;
    error = fallback.error;
  }

  if (process.env.NODE_ENV === "development" && error) {
    console.warn(
      `[ensureProfileViaServiceRole] ${formatPostgrestErr(error)}`
    );
  }

  if (error || !data) return null;
  const row = data;
  return {
    ...row,
    newsletter_access: normalizeNewsletterAccess(row.newsletter_access),
  };
}

export async function getSessionProfile(): Promise<{
  user: { id: string; email?: string; displayName: string };
  profile: Profile;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const userPayload = {
    id: user.id,
    email: user.email ?? undefined,
    displayName: displayNameFromAuthUser(user),
  };

  const row = await fetchProfileRow(supabase, user.id);

  if (row.error) {
    if (isProfilesRelationMissing(row.error)) {
      logSessionProfileDev("public.profiles missing or not exposed", row.error);
      return null;
    }
    if (isProfilesRlsRecursion(row.error)) {
      logSessionProfileDev(
        "profiles RLS infinite recursion — run supabase/sql/fix_profiles_rls_recursion.sql in Supabase SQL Editor",
        row.error
      );
      return null;
    }
    logSessionProfileDev("initial profiles select error; attempting heal", row.error);
  } else if (row.profile) {
    return {
      user: userPayload,
      profile: row.profile,
    };
  }

  await ensureProfileViaRpc(supabase);

  const afterRpc = await fetchProfileRow(supabase, user.id);

  if (afterRpc.profile) {
    return {
      user: userPayload,
      profile: afterRpc.profile,
    };
  }
  if (afterRpc.error) {
    if (isProfilesRelationMissing(afterRpc.error)) {
      logSessionProfileDev("profiles missing after RPC", afterRpc.error);
      return null;
    }
    if (isProfilesRlsRecursion(afterRpc.error)) {
      logSessionProfileDev(
        "profiles RLS infinite recursion after RPC — run supabase/sql/fix_profiles_rls_recursion.sql",
        afterRpc.error
      );
      return null;
    }
    logSessionProfileDev("post-RPC profiles select error; continuing", afterRpc.error);
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email ?? "",
    role: "user",
  });

  if (insertError?.code === "23505") {
    const retry = await fetchProfileRow(supabase, user.id);
    if (retry.profile) {
      return {
        user: userPayload,
        profile: retry.profile,
      };
    }
    const viaAdmin = await ensureProfileViaServiceRole(
      user.id,
      user.email ?? ""
    );
    if (viaAdmin) {
      return {
        user: userPayload,
        profile: viaAdmin,
      };
    }
    return null;
  }

  if (insertError) {
    logSessionProfileDev("user INSERT failed; trying service role", insertError);
    const viaAdmin = await ensureProfileViaServiceRole(
      user.id,
      user.email ?? ""
    );
    if (viaAdmin) {
      return {
        user: userPayload,
        profile: viaAdmin,
      };
    }
    return null;
  }

  const again = await fetchProfileRow(supabase, user.id);
  if (again.profile) {
    return {
      user: userPayload,
      profile: again.profile,
    };
  }
  if (again.error && isProfilesRelationMissing(again.error)) {
    return null;
  }
  if (again.error && isProfilesRlsRecursion(again.error)) {
    logSessionProfileDev(
      "profiles RLS infinite recursion after insert — run supabase/sql/fix_profiles_rls_recursion.sql",
      again.error
    );
    return null;
  }

  const viaAdmin = await ensureProfileViaServiceRole(
    user.id,
    user.email ?? ""
  );
  if (viaAdmin) {
    return {
      user: userPayload,
      profile: viaAdmin,
    };
  }
  return null;
}

export async function requireSessionProfile(): Promise<{
  user: { id: string; email?: string; displayName: string };
  profile: Profile;
}> {
  const s = await getSessionProfile();
  if (!s) throw new Error("Unauthorized");
  return s;
}

export function hasRole(profile: Profile, roles: UserRole[]): boolean {
  return roles.includes(profile.role);
}
