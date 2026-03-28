"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sendPostSignupWelcomeEmail } from "@/app/actions/auth-welcome";
import { setAuthReturnPathClient } from "@/lib/auth/auth-return-path";
import { getBrowserSiteOrigin } from "@/lib/auth/site-origin";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled || !data.user) return;
      window.location.assign("/");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const origin = getBrowserSiteOrigin();
      if (!origin) {
        setMessage(
          "Set NEXT_PUBLIC_SITE_URL in .env.local (e.g. http://localhost:3000)."
        );
        setPending(false);
        return;
      }
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (error) {
        setMessage(error.message);
        setPending(false);
        return;
      }
      if (data.session?.user?.email) {
        await sendPostSignupWelcomeEmail(data.session.user.email);
        window.location.assign("/");
      } else {
        setMessage(
          "Check your email to confirm your account, then sign in."
        );
      }
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
    setAuthReturnPathClient("/");
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
    <main className="mx-auto max-w-md px-6 pt-32 pb-24">
      <h1 className="text-3xl font-bold text-foreground">Create account</h1>
      <p className="mt-2 text-sm text-muted">
        Sign up for Experidium tools and updates.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-foreground bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-foreground bg-white"
          />
        </div>
        {message ? (
          <p className="text-sm text-muted" role="status">
            {message}
          </p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Sign up"}
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={pending}
          onClick={() => oauth("google")}
        >
          Sign up with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={pending}
          onClick={() => oauth("github")}
        >
          Sign up with GitHub
        </Button>
        <p className="text-xs text-muted leading-relaxed">
          <strong className="font-medium text-foreground">HTTP 400</strong> on{" "}
          <code className="text-[11px]">supabase.co</code> means the provider is off in Supabase:{" "}
          <strong className="font-medium text-foreground">Authentication → Providers</strong> → enable Google/GitHub and add OAuth credentials. Google redirect URI:{" "}
          <code className="text-[11px] break-all">https://&lt;project-ref&gt;.supabase.co/auth/v1/callback</code>.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
