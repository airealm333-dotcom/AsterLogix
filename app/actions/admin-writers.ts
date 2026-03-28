"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth" as const, supabase: null };
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return { error: "forbidden" as const, supabase: null };
  return { error: null as null, supabase };
}

export async function approveNewsletterApplicant(userId: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { ok: false, message: "Unauthorized" };

  const { data: updated, error: u1 } = await supabase
    .from("profiles")
    .update({ newsletter_access: "editor" })
    .eq("id", userId)
    .eq("newsletter_access", "pending")
    .select("id");

  if (u1) return { ok: false, message: u1.message };
  if (!updated?.length) {
    return {
      ok: false,
      message: "User does not have a pending newsletter application.",
    };
  }

  await supabase.from("newsletter_applications").delete().eq("user_id", userId);

  revalidatePath("/create/newsletter");
  return { ok: true, message: "Newsletter compose access approved." };
}

export async function rejectNewsletterApplicant(userId: string) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) return { ok: false, message: "Unauthorized" };

  const { data: updated, error: u1 } = await supabase
    .from("profiles")
    .update({ newsletter_access: "none" })
    .eq("id", userId)
    .eq("newsletter_access", "pending")
    .select("id");

  if (u1) return { ok: false, message: u1.message };
  if (!updated?.length) {
    return { ok: false, message: "User is not pending newsletter review." };
  }

  await supabase.from("newsletter_applications").delete().eq("user_id", userId);

  revalidatePath("/create/newsletter");
  return { ok: true, message: "Newsletter application rejected." };
}
