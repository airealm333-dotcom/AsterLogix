import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({ request });
  supabaseResponse.headers.set("x-pathname", path);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        supabaseResponse.headers.set("x-pathname", path);
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Use getSession (cookie-backed) here, not getUser, so we do not contend with
  // RSC/layout auth refresh locks ("another request stole it") on the same token.
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  // Auth pages handle "already signed in" via client redirect.

  if (path.startsWith("/create/newsletter")) {
    if (!user) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", path);
      const redirectRes = NextResponse.redirect(login);
      redirectRes.headers.set("x-pathname", path);
      return redirectRes;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
