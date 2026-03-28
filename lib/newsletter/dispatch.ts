import { siteConfig } from "@/data/site";
import { htmlToPlainTextEmail } from "@/lib/email/newsletter-plain-text";
import { escapeHtmlAttr, getPublicSiteUrl } from "@/lib/email/transactional-layout";
import { wrapNewsletterEmailHtml } from "@/lib/email/wrap-newsletter";
import { buildNewsletterOneClickUnsubscribeUrl } from "@/lib/newsletter/unsubscribe-link";
import {
  getResend,
  getResendFromEmail,
  isResendNewsletterMailConfigured,
} from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function unsubscribeUrlForRecipient(email: string, siteUrl: string): string {
  const https = buildNewsletterOneClickUnsubscribeUrl(siteUrl, email);
  if (https) return https;
  const contact = siteConfig.footer.email?.trim();
  if (contact) {
    return `mailto:${contact}?subject=${encodeURIComponent(`Unsubscribe — ${siteConfig.name}`)}`;
  }
  return `${siteUrl.replace(/\/$/, "")}/contact`;
}

function listUnsubscribeHeader(email: string, siteUrl: string): {
  value: string;
  oneClick: boolean;
} | null {
  const parts: string[] = [];
  const https = buildNewsletterOneClickUnsubscribeUrl(siteUrl, email);
  if (https) parts.push(`<${https}>`);
  const contact = siteConfig.footer.email?.trim();
  if (contact) {
    parts.push(
      `<mailto:${contact}?subject=${encodeURIComponent(`Unsubscribe — ${siteConfig.name}`)}>`
    );
  }
  if (!parts.length) return null;
  return { value: parts.join(", "), oneClick: Boolean(https) };
}

const CHUNK = 25;
const CHUNK_DELAY_MS = 200;

export async function dispatchNewsletterCampaign(
  campaignId: string
): Promise<{ ok: boolean; message: string }> {
  if (!isResendNewsletterMailConfigured()) {
    return { ok: false, message: "Configure Resend to send campaigns." };
  }

  const admin = getSupabaseAdmin();
  const { data: campaign, error: cErr } = await admin
    .from("newsletter_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (cErr || !campaign) {
    return { ok: false, message: "Campaign not found." };
  }

  if (campaign.status === "sent" || campaign.status === "cancelled") {
    return { ok: false, message: "Campaign already finished." };
  }

  await admin
    .from("newsletter_campaigns")
    .update({ status: "sending" })
    .eq("id", campaignId);

  const { data: subs, error: sErr } = await admin
    .from("subscribers")
    .select("email, tags");

  if (sErr) {
    await admin
      .from("newsletter_campaigns")
      .update({ status: "draft" })
      .eq("id", campaignId);
    return { ok: false, message: sErr.message };
  }

  const audienceTags = (campaign as { audience_tags?: string[] | null })
    .audience_tags;

  const emails = (subs ?? [])
    .filter((s) => {
      if (!audienceTags?.length) return true;
      const rowTags = (s.tags as string[]) ?? [];
      return audienceTags.some((t) => rowTags.includes(t));
    })
    .map((s) => s.email as string)
    .filter(Boolean);

  if (emails.length === 0) {
    await admin
      .from("newsletter_campaigns")
      .update({ status: "draft" })
      .eq("id", campaignId);
    return {
      ok: false,
      message:
        "No subscribers match this audience. Add tags on the Subscribers tab or clear the tag filter.",
    };
  }

  const preheader = (campaign as { preheader?: string | null }).preheader;
  const siteUrl = getPublicSiteUrl();
  const htmlTemplate = wrapNewsletterEmailHtml(
    campaign.html_body as string,
    preheader ?? null
  );
  const resend = getResend();
  const from = getResendFromEmail("newsletter");
  const subject = campaign.subject as string;
  const replyTo = siteConfig.footer.email?.trim() || undefined;

  const failures: string[] = [];

  for (let i = 0; i < emails.length; i += CHUNK) {
    const chunk = emails.slice(i, i + CHUNK);
    const results = await Promise.all(
      chunk.map((to) => {
        const unsubUrl = unsubscribeUrlForRecipient(to, siteUrl);
        const html = htmlTemplate
          .replace(
            /\{\{\s*NEWSLETTER_UNSUBSCRIBE_URL\s*\}\}/gi,
            escapeHtmlAttr(unsubUrl)
          )
          .replace(/\{\{\s*unsubscribe\s*\}\}/gi, "");

        const lu = listUnsubscribeHeader(to, siteUrl);
        const headers: Record<string, string> = {};
        if (lu) {
          headers["List-Unsubscribe"] = lu.value;
          if (lu.oneClick) {
            headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
          }
        }

        return resend.emails.send({
          from,
          to,
          subject,
          html,
          text: `${subject}\n\n${htmlToPlainTextEmail(html)}`,
          ...(replyTo ? { replyTo } : {}),
          ...(Object.keys(headers).length ? { headers } : {}),
        });
      })
    );

    results.forEach((result, idx) => {
      if (result.error) {
        const addr = chunk[idx] ?? "?";
        const msg =
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error
            ? String((result.error as { message: string }).message)
            : String(result.error);
        failures.push(`${addr}: ${msg}`);
      }
    });

    if (i + CHUNK < emails.length) {
      await new Promise((r) => setTimeout(r, CHUNK_DELAY_MS));
    }
  }

  if (failures.length > 0) {
    await admin
      .from("newsletter_campaigns")
      .update({ status: "draft" })
      .eq("id", campaignId);
    return {
      ok: false,
      message: `Resend rejected ${failures.length} of ${emails.length} send(s). ${failures.join(" · ")} Open Resend → Logs; verify domain and RESEND_NEWSLETTER_FROM / RESEND_FROM_EMAIL.`,
    };
  }

  await admin
    .from("newsletter_campaigns")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", campaignId);

  return { ok: true, message: `Sent to ${emails.length} subscribers.` };
}
