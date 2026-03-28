import { siteConfig } from "@/data/site";
import {
  emailCtaButton,
  emailFieldTable,
  emailQuoteBlock,
  escapeHtml,
  escapeHtmlAttr,
  getPublicSiteUrl,
  mailtoHref,
  nl2brEscaped,
  transactionalEmailHtml,
} from "@/lib/email/transactional-layout";
import {
  getResend,
  getResendFromEmail,
  isResendContactMailConfigured,
} from "@/lib/resend";

export async function notifyAdminNewsletterApplication(
  applicantEmail: string,
  reason: string
): Promise<void> {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL?.trim();
  if (!adminEmail || !isResendContactMailConfigured()) return;

  try {
    const resend = getResend();
    const from = getResendFromEmail("contact");
    const base = getPublicSiteUrl();
    const brand = siteConfig.name;
    const bodyHtml = `
      <p style="margin:0 0 4px;font-size:15px;line-height:1.55;color:#52525b;">A signed-in user requested newsletter compose access.</p>
      ${emailFieldTable([
        {
          label: "Applicant",
          valueHtml: `<a href="${escapeHtmlAttr(mailtoHref(applicantEmail))}" style="color:#3f6212;font-weight:600;text-decoration:none;">${escapeHtml(applicantEmail)}</a>`,
        },
      ])}
      <p style="margin:20px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#71717a;">Reason / pitch</p>
      ${emailQuoteBlock(nl2brEscaped(reason))}
      ${emailCtaButton(`${base}/create/newsletter`, "Open newsletter admin")}`;

    const html = transactionalEmailHtml({
      previewText: `${applicantEmail} applied for compose access`,
      title: "Newsletter access request",
      bodyHtml,
      siteUrl: base,
      footerKind: "internal",
    });

    const text = `Newsletter compose application — ${brand}

Applicant: ${applicantEmail}

Reason / pitch:
${reason}

${base}/create/newsletter`;

    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `[${brand}] Newsletter access request`,
      html,
      text,
    });
  } catch (e) {
    console.error("notifyAdminNewsletterApplication:", e);
  }
}
