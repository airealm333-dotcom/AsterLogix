import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function clearSessionAndBuildResponse(res: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, message: "Missing Supabase env" }, { status: 500 });
  }

  const cookieStore = (await cookies()) as any;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return typeof cookieStore.getAll === "function" ? cookieStore.getAll() : [];
      },
      setAll(cookiesToSet) {
        // Supabase uses this to clear auth cookies on signOut().
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.signOut();
  return res;
}

export async function POST() {
  return clearSessionAndBuildResponse(NextResponse.json({ ok: true }));
}

export async function GET(request: Request) {
  const target = new URL("/", request.url);
  return clearSessionAndBuildResponse(NextResponse.redirect(target));
}

