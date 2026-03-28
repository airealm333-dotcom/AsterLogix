import { NextResponse } from "next/server";
import { getSupabaseAdminIfConfigured } from "@/lib/supabase/admin";
import { verifyNewsletterUnsubscribeParams } from "@/lib/newsletter/unsubscribe-link";

/**
 * One-click list unsubscribe (RFC 8058) + browser GET fallback.
 * Removes the address from `subscribers` when the signed link is valid.
 */
export async function POST(req: Request) {
  return handleUnsubscribe(req, "post");
}

export async function GET(req: Request) {
  return handleUnsubscribe(req, "get");
}

async function handleUnsubscribe(req: Request, kind: "get" | "post") {
  const url = new URL(req.url);
  const email = verifyNewsletterUnsubscribeParams(
    url.searchParams.get("e"),
    url.searchParams.get("s")
  );

  if (!email) {
    return new NextResponse("Invalid or expired unsubscribe link.", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const admin = getSupabaseAdminIfConfigured();
  if (!admin) {
    return new NextResponse("Service unavailable.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { error } = await admin.from("subscribers").delete().eq("email", email);

  if (error) {
    return new NextResponse("Could not update subscription. Try again later.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (kind === "post") {
    return new NextResponse("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Unsubscribed</title></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1rem;line-height:1.5;">
<p>You’re unsubscribed from our mailing list for <strong>${escapeHtml(email)}</strong>.</p>
<p style="color:#666;font-size:14px;">You can close this tab.</p>
</body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
