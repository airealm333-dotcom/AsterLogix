import { siteConfig } from "@/data/site";

const BRAND = {
  outerBg: "#f4f4f5",
  cardBg: "#ffffff",
  border: "#e4e4e7",
  headerBg: "#18181b",
  headerAccent: "#bef264",
  text: "#18181b",
  muted: "#52525b",
  footerText: "#71717a",
  link: "#3f6212",
  rowBorder: "#f4f4f5",
} as const;

export function getPublicSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://experidium.com").replace(
    /\/$/,
    ""
  );
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Safe for double-quoted HTML attributes. */
export function escapeHtmlAttr(s: string): string {
  return escapeHtml(s);
}

/** Safe `mailto:` href for a validated email address. */
export function mailtoHref(email: string): string {
  return `mailto:${encodeURIComponent(email)}`;
}

export function nl2brEscaped(text: string): string {
  return escapeHtml(text).replace(/\r\n/g, "\n").replace(/\n/g, "<br/>");
}

export type TransactionalEmailOptions = {
  previewText?: string;
  title: string;
  bodyHtml: string;
  siteUrl?: string;
  /** internal = short “notification” footer */
  footerKind?: "default" | "internal";
};

/**
 * Table-based layout for reliable rendering in Gmail, Outlook, Apple Mail.
 */
export function transactionalEmailHtml(opts: TransactionalEmailOptions): string {
  const siteUrl = (opts.siteUrl ?? getPublicSiteUrl()).replace(/\/$/, "");
  const brandName = siteConfig.name;
  const pre = opts.previewText?.trim();
  const preheaderBlock = pre
    ? `<div style="display:none!important;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:transparent;width:0;height:0;">${escapeHtml(pre)}</div>`
    : "";

  const footerDefault = `
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${BRAND.footerText};">
      <a href="${escapeHtmlAttr(siteUrl)}" style="color:${BRAND.link};font-weight:600;text-decoration:none;">${escapeHtml(brandName)}</a>
      <span style="color:#d4d4d8;"> · </span>
      <a href="${escapeHtmlAttr(`${siteUrl}/contact`)}" style="color:${BRAND.link};text-decoration:none;">Contact</a>
      <span style="color:#d4d4d8;"> · </span>
      <a href="${escapeHtmlAttr(`${siteUrl}/privacy-policy`)}" style="color:${BRAND.link};text-decoration:none;">Privacy</a>
    </p>
    <p style="margin:0;font-size:11px;line-height:1.5;color:#a1a1aa;">
      You’re receiving this because you interacted with ${escapeHtml(brandName)}.
    </p>`;

  const footerInternal = `
    <p style="margin:0;font-size:12px;line-height:1.5;color:${BRAND.footerText};">
      Internal notification · <a href="${escapeHtmlAttr(`${siteUrl}/create/newsletter`)}" style="color:${BRAND.link};text-decoration:none;">Admin</a>
      · <a href="${escapeHtmlAttr(siteUrl)}" style="color:${BRAND.link};text-decoration:none;">${escapeHtml(brandName)}</a>
    </p>`;

  const footer =
    opts.footerKind === "internal" ? footerInternal : footerDefault;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.outerBg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:${BRAND.text};-webkit-font-smoothing:antialiased;">
  ${preheaderBlock}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.outerBg};padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.cardBg};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:22px 28px;background:${BRAND.headerBg};border-bottom:3px solid ${BRAND.headerAccent};">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.headerAccent};">${escapeHtml(brandName)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;">
              <h1 style="margin:0;font-size:22px;font-weight:700;line-height:1.3;color:${BRAND.text};letter-spacing:-0.02em;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-size:16px;line-height:1.65;color:${BRAND.text};">
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background:#fafafa;border-top:1px solid ${BRAND.border};">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailCtaButton(href: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:20px 0 0;">
  <tr>
    <td style="border-radius:10px;background:${BRAND.headerBg};">
      <a href="${escapeHtmlAttr(href)}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:${BRAND.headerAccent};text-decoration:none;border-radius:10px;">${escapeHtml(label)}</a>
    </td>
  </tr>
</table>`;
}

/** Two-column field list for admin / confirmation content. */
export function emailFieldTable(
  rows: { label: string; valueHtml: string }[]
): string {
  const cells = rows
    .map(
      (r) => `<tr>
  <td style="padding:12px 16px 12px 0;border-bottom:1px solid ${BRAND.rowBorder};vertical-align:top;width:132px;font-size:13px;font-weight:700;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(r.label)}</td>
  <td style="padding:12px 0;border-bottom:1px solid ${BRAND.rowBorder};vertical-align:top;font-size:15px;line-height:1.55;color:${BRAND.text};">${r.valueHtml}</td>
</tr>`
    )
    .join("");
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:8px 0 0;">${cells}</table>`;
}

/** Bordered block for long message / notes. */
export function emailQuoteBlock(innerHtml: string): string {
  return `<div style="margin:16px 0 0;padding:16px 18px;background:#fafafa;border-left:4px solid ${BRAND.headerAccent};border-radius:0 8px 8px 0;font-size:15px;line-height:1.6;color:${BRAND.text};">${innerHtml}</div>`;
}
