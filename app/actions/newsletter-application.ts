"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const applySchema = z.object({
  reason: z.string().trim().min(20, "Please share at least 20 characters."),
  portfolio: z.string().trim().optional(),
});

export async function applyForNewsletter(
  _prev: { ok: boolean; message: string },
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  const parsed = applySchema.safeParse({
    reason: formData.get("reason"),
    portfolio: formData.get("portfolio") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "You must be signed in." };
  }

  return {
    ok: false,
    message:
      "Newsletter campaigns are managed by site administrators. Members use the blog to contribute articles.",
  };
}
