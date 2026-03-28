"use client";

import { useState } from "react";

type Props = {
  className?: string;
  /** e.g. close mobile nav after signing out */
  onAfterSignOut?: () => void;
};

export default function SignOutButton({
  className = "text-xs text-muted hover:text-foreground underline",
  onAfterSignOut,
}: Props) {
  const [pending, setPending] = useState(false);

  async function signOut() {
    if (pending) return;
    setPending(true);
    try {
    } catch (e) {
      console.error("SignOutButton.signOut:", e);
    } finally {
      onAfterSignOut?.();
      // Server endpoint clears cookies and redirects home.
      window.location.assign("/auth/logout");
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out…" : "Log out"}
    </button>
  );
}
