"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, UserCircle } from "lucide-react";

type Props = {
  user: User;
  showDarkNav: boolean;
  isAdmin?: boolean;
  onNavigate?: () => void;
};

export default function UserMenu({
  user,
  showDarkNav,
  isAdmin = false,
  onNavigate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined);

  const isGoogleHost =
    typeof avatarUrl === "string" &&
    avatarUrl.includes("googleusercontent.com");

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  async function signOut() {
    if (pending) return;
    setPending(true);
    try {
      setOpen(false);
      onNavigate?.();
    } catch (e) {
      console.error("UserMenu.signOut:", e);
    } finally {
      // Server endpoint clears cookies and redirects home.
      window.location.assign("/auth/logout");
      setPending(false);
    }
  }

  const triggerRing = showDarkNav
    ? "ring-border text-foreground hover:bg-surface"
    : "ring-white/40 text-white hover:bg-white/10";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        className={`flex h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-inset transition-colors ${triggerRing}`}
      >
        {avatarUrl ? (
          isGoogleHost ? (
            <Image
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <UserCircle
            className={`h-7 w-7 sm:h-8 sm:w-8 ${showDarkNav ? "text-muted" : "text-white"}`}
            strokeWidth={1.5}
          />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-[80] mt-2 w-60 rounded-2xl border border-border bg-white py-2 shadow-xl"
        >
          <div className="border-b border-border px-3 pb-2 mb-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.user_metadata?.full_name ??
                user.user_metadata?.name ??
                "Account"}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>

          {isAdmin ? (
            <Link
              href="/create/newsletter"
              role="menuitem"
              prefetch={false}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-surface"
            >
              Admin dashboard
            </Link>
          ) : null}
          <button
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() => void signOut()}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground hover:bg-surface disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 text-muted" />
            {pending ? "Signing out…" : "Log out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
