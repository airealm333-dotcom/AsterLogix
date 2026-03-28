import { siteConfig } from "@/data/site";
import { escapeHtml, getPublicSiteUrl } from "@/lib/email/transactional-layout";

/**
 * Wraps newsletter HTML with Experidium branding.
 * `{{NEWSLETTER_UNSUBSCRIBE_URL}}` in the footer is replaced per recipient in `dispatch.ts`.
 * @param preheader Optional inbox preview line (inserted as hidden preview text for email clients).
 */
export function wrapNewsletterEmailHtml(
  innerHtml: string,
  preheader?: string | null
): string {
  const pre = preheader?.trim();
  const preheaderBlock = pre
    ? `<div style="display:none!important;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:transparent;width:0;height:0;">${escapeHtml(pre)}</div>`
    : "";

  const brand = siteConfig.name;
  const siteBase = getPublicSiteUrl();
  const privacyUrl = `${siteBase}/privacy-policy`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e4e7;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:22px 32px;background:#18181b;border-bottom:3px solid #bef264;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#bef264;">${escapeHtml(brand)}</p>
              <p style="margin:6px 0 0;font-size:13px;font-weight:500;color:#a1a1aa;">Update</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${preheaderBlock}
              <div style="font-size:16px;line-height:1.65;color:#18181b;">${innerHtml}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:#fafafa;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;line-height:1.55;">
              <p style="margin:0 0 8px;">You’re receiving this because you asked for updates from <strong style="color:#3f3f46;">${escapeHtml(brand)}</strong>.</p>
              <p style="margin:0;">
                <a href="{{NEWSLETTER_UNSUBSCRIBE_URL}}" style="color:#3f6212;font-weight:600;text-decoration:none;">Unsubscribe</a>
                <span style="color:#d4d4d8;"> · </span>
                <a href="${escapeHtml(privacyUrl)}" style="color:#3f6212;font-weight:600;text-decoration:none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
