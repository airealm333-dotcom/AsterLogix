import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdminIfConfigured } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Cover image upload using the **service role** after session + admin check.
 * Avoids Storage RLS issues (e.g. policy subqueries on `profiles`) that break client uploads.
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (max ${MAX_BYTES / 1024 / 1024} MB).` },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!isAdmin(profile?.role)) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const admin = getSupabaseAdminIfConfigured();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_SERVICE_ROLE_KEY — cannot upload to storage.",
      },
      { status: 503 }
    );
  }

  const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const base = safe.replace(/\.[^/.]+$/, "") || "cover";
  const ext =
    file.type === "image/gif"
      ? ".gif"
      : file.type === "image/png"
        ? ".png"
        : file.type === "image/webp"
          ? ".webp"
          : ".jpg";
  const path = `covers/${user.id}/${Date.now()}-${base}${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from("blog-media").upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: false,
    cacheControl: "31536000",
  });

  if (error) {
    console.error("[upload-cover]", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "Storage upload failed. Check the blog-media bucket exists.",
      },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("blog-media").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
