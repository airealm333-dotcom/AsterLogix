"use server";

import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  getResend,
  getResendFromEmail,
  isResendNewsletterMailConfigured,
} from "@/lib/resend";
import { syncSubscriberToBrevo } from "@/lib/brevo";
import { siteConfig } from "@/data/site";
import {
  emailCtaButton,
  escapeHtml,
  getPublicSiteUrl,
  transactionalEmailHtml,
} from "@/lib/email/transactional-layout";

export type SubscribeState = {
  ok: boolean;
  message: string;
};

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export async function subscribe(
  _prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  const raw = formData.get("email");
  const parsed = emailSchema.safeParse(
    typeof raw === "string" ? raw : ""
  );

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Invalid email" };
  }

  const email = parsed.data.toLowerCase();

  try {
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email, tags: [] });

    if (insertError) {
      // Unique violation (already subscribed)
      if (insertError.code === "23505") {
        await syncSubscriberToBrevo(email);
        return {
          ok: true,
          message: "You’re already subscribed. Thanks for your interest!",
        };
      }
      console.error("Supabase insert error:", insertError);
      return {
        ok: false,
        message:
          insertError.message?.includes("relation") &&
          insertError.message?.includes("does not exist")
            ? "Database table missing. Run the subscribers SQL in Supabase (see README)."
            : "Could not save your subscription. Please try again later.",
      };
    }

    await syncSubscriberToBrevo(email);

    const siteName = siteConfig.name;
    const siteUrl = getPublicSiteUrl();

    if (!isResendNewsletterMailConfigured()) {
      return {
        ok: true,
        message:
          "You’re subscribed! Add Resend keys to `.env.local` to enable welcome emails.",
      };
    }

    const resend = getResend();
    const from = getResendFromEmail("newsletter");

    const welcomeBody = `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi there,</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thanks for subscribing to <strong>${escapeHtml(siteName)}</strong>. You’ll get <strong>supply chain AI insights</strong>, product updates, and practical notes in your inbox — no spam, unsubscribe anytime from any email we send.</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#52525b;">— The ${escapeHtml(siteName)} team</p>
      ${emailCtaButton(siteUrl, `Explore ${siteName}`)}`;

    const welcomeHtml = transactionalEmailHtml({
      previewText: `Supply chain AI insights from ${siteName}`,
      title: "You’re subscribed",
      bodyHtml: welcomeBody,
      siteUrl,
    });

    const welcomeText = `Hi there,

Thanks for subscribing to ${siteName}. You’ll get supply chain AI insights and updates in your inbox.

— The ${siteName} team

${siteUrl}`;

    const { error: sendError } = await resend.emails.send({
      from,
      to: email,
      subject: `Welcome — ${siteName} insights`,
      html: welcomeHtml,
      text: welcomeText,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      return {
        ok: true,
        message:
          "You’re subscribed! (Welcome email could not be sent right now.)",
      };
    }

    return {
      ok: true,
      message: "Thanks! Check your inbox for a welcome message.",
    };
  } catch (e) {
    console.error("subscribe action:", e);
    return {
      ok: false,
      message:
        "Newsletter is not configured yet. Add Supabase URL + service role key to `.env.local` (see `.env.example`).",
    };
  }
}
