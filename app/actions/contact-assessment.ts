"use server";

import { z } from "zod";
import {
  getResend,
  getResendFromEmail,
  isResendContactMailConfigured,
} from "@/lib/resend";
import { getSupabaseAdmin } from "@/lib/supabase";
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

export type ContactAssessmentState = {
  ok: boolean;
  message: string;
};

const schema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(120),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(120),
  email: z.string().trim().email("Please enter a valid work email"),
  company_role: z.string().trim().max(300),
  message: z
    .string()
    .trim()
    .min(
      10,
      "Please share a bit more about your challenges (at least 10 characters)"
    )
    .max(8000),
});

function getContactFormDestination(): string | null {
  const direct = process.env.CONTACT_FORM_TO_EMAIL?.trim();
  if (direct) return direct;
  return process.env.ADMIN_ALERT_EMAIL?.trim() ?? null;
}

export async function submitContactAssessment(
  _prev: ContactAssessmentState,
  formData: FormData
): Promise<ContactAssessmentState> {
  const honeypot = formData.get("company_website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return {
      ok: true,
      message: "Thanks — we’ll be in touch shortly.",
    };
  }

  const parsed = schema.safeParse({
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    company_role: formData.get("company_role"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      message: first?.message ?? "Please check your details and try again.",
    };
  }

  const data = parsed.data;
  const to = getContactFormDestination();

  if (!to || !isResendContactMailConfigured()) {
    return {
      ok: false,
      message:
        "We couldn’t send your message right now. Please email us directly or try again later.",
    };
  }

  const base = getPublicSiteUrl();
  const brand = siteConfig.name;
  const fullName = `${data.first_name} ${data.last_name}`;
  const fieldRows: { label: string; valueHtml: string }[] = [
    { label: "Name", valueHtml: escapeHtml(fullName) },
    {
      label: "Email",
      valueHtml: `<a href="${escapeHtmlAttr(mailtoHref(data.email))}" style="color:#3f6212;font-weight:600;text-decoration:none;">${escapeHtml(data.email)}</a>`,
    },
  ];
  if (data.company_role.trim()) {
    fieldRows.push({
      label: "Role",
      valueHtml: escapeHtml(data.company_role),
    });
  }

  const adminBodyHtml = `
    <p style="margin:0 0 4px;font-size:15px;line-height:1.55;color:#52525b;">Someone submitted the contact form on your site.</p>
    ${emailFieldTable(fieldRows)}
    <p style="margin:20px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#71717a;">Message</p>
    ${emailQuoteBlock(nl2brEscaped(data.message))}
    ${emailCtaButton(`${base}/contact`, "Open contact page")}`;

  const adminHtml = transactionalEmailHtml({
    previewText: `${fullName} — ${data.email}`,
    title: "New contact form submission",
    bodyHtml: adminBodyHtml,
    siteUrl: base,
    footerKind: "internal",
  });

  const adminText = `New contact — ${brand}

Name: ${fullName}
Email: ${data.email}
${data.company_role.trim() ? `Role: ${data.company_role}\n` : ""}
Message:
${data.message}

${base}/contact`;

  const autoBodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(data.first_name)},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Thanks for reaching out to <strong>${escapeHtml(brand)}</strong>. We’ve received your message and our team will review it shortly — we usually respond within <strong>one business day</strong>.</p>
    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">If your request is urgent, just <strong>reply to this email</strong> and it goes straight to us.</p>
    <p style="margin:0;font-size:15px;line-height:1.5;color:#52525b;">— The ${escapeHtml(brand)} team</p>
    ${emailCtaButton(base, `Visit ${brand}`)}`;

  const autoHtml = transactionalEmailHtml({
    previewText: "We’ll reply within one business day.",
    title: "We’ve received your message",
    bodyHtml: autoBodyHtml,
    siteUrl: base,
  });

  const autoText = `Hi ${data.first_name},

Thanks for reaching out to ${brand}. We’ve received your message and will review it soon — we usually reply within one business day.

If your request is urgent, reply to this email and it will reach our team.

— The ${brand} team

${base}`;

  try {
    const resend = getResend();
    const from = getResendFromEmail("contact");
    await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[${brand}] Contact: ${fullName}`,
      html: adminHtml,
      text: adminText,
    });

    try {
      await resend.emails.send({
        from,
        to: data.email,
        replyTo: to,
        subject: `We received your message — ${brand}`,
        html: autoHtml,
        text: autoText,
      });
    } catch (autoReplyErr) {
      console.error("submitContactAssessment auto-reply:", autoReplyErr);
    }
  } catch (e) {
    console.error("submitContactAssessment email:", e);
    return {
      ok: false,
      message:
        "We couldn’t send your message. Please try again or email us directly.",
    };
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("contact_leads").insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email.toLowerCase(),
      company_role: data.company_role || null,
      message: data.message,
    });
    if (error) {
      console.error("contact_leads insert:", error);
    }
  } catch (e) {
    console.error("contact_leads:", e);
  }

  return {
    ok: true,
    message:
      "Thanks — we received your request and we’ll reply within one business day.",
  };
}
