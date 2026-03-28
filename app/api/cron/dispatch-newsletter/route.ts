import { NextResponse } from "next/server";
import { dispatchNewsletterCampaign } from "@/lib/newsletter/dispatch";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/** Allow long sends (many subscribers × Resend). Hobby plan still caps lower. */
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        error: "CRON_SECRET is not set",
        hint: "Add CRON_SECRET to Vercel → Project → Settings → Environment Variables (Production). Vercel Cron sends Authorization: Bearer <CRON_SECRET> automatically.",
      },
      { status: 503 }
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        hint: "Expected header Authorization: Bearer <same value as CRON_SECRET>. For manual tests: curl -H \"Authorization: Bearer YOUR_SECRET\" YOUR_SITE/api/cron/dispatch-newsletter",
      },
      { status: 401 }
    );
  }

  const admin = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: due, error } = await admin
    .from("newsletter_campaigns")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_at", now);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: string[] = [];
  for (const row of due ?? []) {
    const r = await dispatchNewsletterCampaign(row.id as string);
    results.push(`${row.id}: ${r.message}`);
  }

  return NextResponse.json({
    count: due?.length ?? 0,
    results,
  });
}
