/**
 * Smoke test: same Supabase project as the app, profiles table, service role.
 * Usage: npm run verify:supabase
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import { createClient } from "@supabase/supabase-js";

function projectRefFromUrl(urlStr: string): string {
  try {
    const host = new URL(urlStr).hostname;
    const m = host.match(/^([^.]+)\.supabase\.co$/);
    return m ? m[1] : host;
  } catch {
    return "(invalid URL)";
  }
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const srk = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url) {
    console.error("FAIL: NEXT_PUBLIC_SUPABASE_URL missing");
    process.exit(1);
  }

  console.log(
    "INFO: App is configured for Supabase host:",
    projectRefFromUrl(url),
    "— confirm this matches the project where you ran SQL (Dashboard → Settings → API)."
  );

  if (!srk) {
    console.warn(
      "WARN: SUPABASE_SERVICE_ROLE_KEY missing — server-side profile upsert is disabled."
    );
    console.warn(
      "      Add it to .env.local, or rely on ensure_my_profile RPC + profiles_insert_own RLS."
    );
    console.warn(
      "      SQL diagnostics (run in Supabase SQL Editor): see README → Supabase schema."
    );
    process.exit(0);
  }

  const admin = createClient(url, srk, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("FAIL: profiles query:", error.code, error.message);
    if (error.code === "PGRST205" || /profiles/i.test(String(error.message))) {
      console.error(
        "      → Run supabase/sql/auth_rbac_newsletter.sql in the Supabase SQL Editor for THIS project."
      );
    }
    process.exit(1);
  }

  console.log(
    "OK: profiles table reachable with service role (row count:",
    count ?? "?",
    ")."
  );
  console.log(
    "TIP: In SQL Editor, confirm RPC: select routine_name from information_schema.routines where specific_schema = 'public' and routine_name = 'ensure_my_profile';"
  );

  process.exit(0);
}

main();
