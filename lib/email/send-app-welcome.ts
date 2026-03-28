import { siteConfig } from "@/data/site";
import {
  emailCtaButton,
  escapeHtml,
  getPublicSiteUrl,
  transactionalEmailHtml,
} from "@/lib/email/transactional-layout";
import {
  getResend,
  getResendFromEmail,
  isResendContactMailConfigured,
} from "@/lib/resend";

export async function sendAppAccountWelcomeEmail(
  toEmail: string
): Promise<{ ok: boolean; error?: string }> {
  if (!isResendContactMailConfigured()) {
    return { ok: false, error: "Resend not configured" };
  }
  try {
    const resend = getResend();
    const from = getResendFromEmail("contact");
    const brand = siteConfig.name;
    const siteUrl = getPublicSiteUrl();
    const dashboardUrl = `${siteUrl}/dashboard`;

    const bodyHtml = `
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi,</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Your <strong>${escapeHtml(brand)}</strong> account is ready. Sign in anytime to open your <strong>dashboard</strong>, manage preferences, and use the tools we’ve enabled for you.</p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:#52525b;">— The ${escapeHtml(brand)} team</p>
      ${emailCtaButton(dashboardUrl, "Go to dashboard")}`;

    const html = transactionalEmailHtml({
      previewText: `Your ${brand} account is ready`,
      title: `Welcome to ${brand}`,
      bodyHtml,
      siteUrl,
    });

    const text = `Hi,

Your ${brand} account is ready. Sign in anytime to access your dashboard and tools.

— The ${brand} team

${dashboardUrl}`;

    const { error } = await resend.emails.send({
      from,
      to: toEmail,
      subject: `Welcome to ${brand}`,
      html,
      text,
    });
    if (error) return { ok: false, error: String(error) };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "send failed" };
  }
}
