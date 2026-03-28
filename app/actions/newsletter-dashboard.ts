"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { dispatchNewsletterCampaign } from "@/lib/newsletter/dispatch";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: me } = await supabase
    .from("profiles")
    .select("role, id")
    .eq("id", user.id)
    .single();
  if (me?.role !== "admin") return null;
  return { supabase, userId: user.id };
}

export async function updateSubscriberTags(
  subscriberId: string,
  tagsCsv: string
) {
  const ctx = await requireAdmin();
  if (!ctx) return { ok: false, message: "Unauthorized" };

  const tags = tagsCsv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await ctx.supabase
    .from("subscribers")
    .update({ tags })
    .eq("id", subscriberId);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/create/newsletter");
  return { ok: true, message: "Tags updated." };
}

export async function updateSubscriberTagsForm(
  _prev: { ok: boolean; message: string },
  formData: FormData
) {
  const id = String(formData.get("subscriber_id") ?? "");
  const csv = String(formData.get("tags_csv") ?? "");
  return updateSubscriberTags(id, csv);
}

const campaignSchema = z.object({
  subject: z.string().trim().min(2),
  html_body: z.string().min(1),
  campaign_mode: z.enum(["now", "schedule"]),
  scheduled_at: z.string().optional(),
  preheader: z.string().optional(),
  audience_tags: z.string().optional(),
});

function parseAudienceTags(raw: string | undefined): string[] | null {
  const s = (raw ?? "").trim();
  if (!s) return null;
  const tags = s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  return tags.length ? tags : null;
}

export async function createNewsletterCampaign(
  _prev: { ok: boolean; message: string },
  formData: FormData
) {
  const ctx = await requireAdmin();
  if (!ctx) return { ok: false, message: "Unauthorized" };

  const parsed = campaignSchema.safeParse({
    subject: formData.get("subject"),
    html_body: formData.get("html_body"),
    campaign_mode: formData.get("campaign_mode"),
    scheduled_at: formData.get("scheduled_at") || undefined,
    preheader: formData.get("preheader") || undefined,
    audience_tags: formData.get("audience_tags") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid",
    };
  }

  if (
    parsed.data.campaign_mode === "schedule" &&
    !parsed.data.scheduled_at?.trim()
  ) {
    return {
      ok: false,
      message: "Choose a schedule date and time.",
    };
  }

  const status =
    parsed.data.campaign_mode === "schedule" && parsed.data.scheduled_at
      ? "scheduled"
      : "draft";

  const scheduledAt =
    parsed.data.campaign_mode === "schedule" && parsed.data.scheduled_at
      ? new Date(parsed.data.scheduled_at).toISOString()
      : null;

  if (
    status === "scheduled" &&
    scheduledAt &&
    Number.isNaN(Date.parse(scheduledAt))
  ) {
    return { ok: false, message: "Invalid schedule date." };
  }

  const preheaderTrim = parsed.data.preheader?.trim();
  const audience_tags = parseAudienceTags(parsed.data.audience_tags);

  const insertPayload: Record<string, unknown> = {
    subject: parsed.data.subject,
    html_body: parsed.data.html_body,
    status,
    scheduled_at: scheduledAt,
    created_by: ctx.userId,
    preheader: preheaderTrim ? preheaderTrim : null,
    audience_tags,
  };

  const { data: row, error } = await ctx.supabase
    .from("newsletter_campaigns")
    .insert(insertPayload)
    .select("id")
    .single();

  if (error || !row) {
    const hint =
      error?.message?.includes("column") || error?.code === "PGRST204"
        ? " Run supabase/sql/newsletter_campaign_preheader_audience.sql if you have not added the new columns."
        : "";
    return {
      ok: false,
      message: (error?.message ?? "Insert failed") + hint,
    };
  }

  revalidatePath("/create/newsletter");
  if (parsed.data.campaign_mode === "now") {
    const result = await dispatchNewsletterCampaign(row.id as string);
    return result.ok
      ? { ok: true, message: result.message }
      : { ok: false, message: result.message };
  }

  return {
    ok: true,
    message:
      status === "scheduled"
        ? "Campaign scheduled. Cron will dispatch when due."
        : "Campaign saved as draft.",
  };
}
