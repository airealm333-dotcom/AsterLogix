import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_RETURN_COOKIE } from "@/lib/auth/auth-return-path";
import { sendAppAccountWelcomeEmail } from "@/lib/email/send-app-welcome";

function safeNextPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(AUTH_RETURN_COOKIE)?.value;
  const nextFromQuery = searchParams.get("next");
  let nextRaw = nextFromQuery ?? "/";
  if (fromCookie) {
    try {
      nextRaw = decodeURIComponent(fromCookie);
    } catch {
      nextRaw = "/";
    }
  }
  const next = safeNextPath(nextRaw);

  if (!code) {
    const res = NextResponse.redirect(`${origin}/login?error=missing_code`);
    res.cookies.set(AUTH_RETURN_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    const res = NextResponse.redirect(`${origin}/login?error=config`);
    res.cookies.set(AUTH_RETURN_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          /* ignore */
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const res = NextResponse.redirect(`${origin}/login?error=exchange`);
    res.cookies.set(AUTH_RETURN_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.email && user.created_at) {
    const created = new Date(user.created_at).getTime();
    if (Date.now() - created < 120_000) {
      await sendAppAccountWelcomeEmail(user.email);
    }
  }

  const res = NextResponse.redirect(`${origin}${next}`);
  res.cookies.set(AUTH_RETURN_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
