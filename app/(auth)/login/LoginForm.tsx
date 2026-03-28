"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { setAuthReturnPathClient } from "@/lib/auth/auth-return-path";
import { safeClientRedirectPath } from "@/lib/auth/safe-path";
import { getBrowserSiteOrigin } from "@/lib/auth/site-origin";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) return;
      window.location.assign(safeClientRedirectPath(next));
    });
    return () => {
      cancelled = true;
    };
  }, [next]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
        setPending(false);
        return;
      }
      window.location.assign(safeClientRedirectPath(next));
    } catch {
      setMessage("Something went wrong.");
    }
    setPending(false);
  }

  async function oauth(provider: "google" | "github") {
    const origin = getBrowserSiteOrigin();
    if (!origin) {
      setMessage(
        "Set NEXT_PUBLIC_SITE_URL in .env.local to match this site (e.g. http://localhost:3000)."
      );
      return;
    }
    setPending(true);
    setMessage("");
    setAuthReturnPathClient(next);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    if (error) {
      setMessage(error.message);
      setPending(false);
      return;
    }
    if (data?.url) {
      window.location.assign(data.url);
      return;
    }
    setPending(false);
    setMessage("Could not start sign-in. Enable the provider in Supabase Auth.");
  }

  return (
    <main className="mx-auto max-w-lg px-6 pt-28 pb-24">
      <div className="mt-14 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-foreground">Log in</h1>
        <p className="mt-2 text-sm text-muted">
          Access your Experidium account.
        </p>

        {params.get("error") ? (
          <p className="mt-4 text-sm text-red-600">
            Sign-in failed. Try again or use email/password.
          </p>
        ) : null}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-foreground"
            />
          </div>
          {message ? (
            <p className="text-sm text-red-600" role="alert">
              {message}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-6">
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending}
              onClick={() => oauth("google")}
            >
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending}
              onClick={() => oauth("github")}
            >
              Continue with GitHub
            </Button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
