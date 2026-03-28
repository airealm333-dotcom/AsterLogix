"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site";
import Button from "@/components/ui/Button";
import SignOutButton from "@/components/dashboard/SignOutButton";
import UserMenu from "@/components/layout/UserMenu";
import CalendlyBookingModal from "@/components/booking/CalendlyBookingModal";
import { createClient } from "@/lib/supabase/client";

const calendlyBookingUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() ||
  siteConfig.bookingCalendlyUrl;

type HeaderProps = {
  /** From server `getSessionProfile()` so admin links work before client `profiles` fetch. */
  initialIsAdmin?: boolean;
};

export default function Header({ initialIsAdmin = false }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const isHomePage = pathname === "/";
  const showDarkNav = scrolled || !isHomePage;

  useEffect(() => {
    let client: ReturnType<typeof createClient> | null = null;
    try {
      client = createClient();
    } catch {
      setAuthUser(null);
      return;
    }

    async function syncRole(userId: string | null | undefined) {
      if (!userId) {
        setIsAdmin(false);
        return;
      }
      // Direct profiles read only (RLS: own row). Avoid browser RPCs like ensure_my_profile —
      // they can hang and block admin detection. Server getSessionProfile() heals profiles.
      const { data, error } = await client!
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();
      if (error && process.env.NODE_ENV === "development") {
        console.warn("[Header] profiles role fetch:", error.message);
      }
      setIsAdmin(data?.role === "admin");
    }

    client.auth.getUser().then(async ({ data }) => {
      setAuthUser(data.user ?? null);
      await syncRole(data.user?.id);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange(async (_event, session) => {
      setAuthUser(session?.user ?? null);
      await syncRole(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className={`mx-auto max-w-7xl px-4 transition-all duration-300 ${
            showDarkNav ? "pt-2" : "pt-4"
          }`}
        >
          <nav
            className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-300 ${
              showDarkNav
                ? "bg-white/95 backdrop-blur-md shadow-lg"
                : "bg-transparent border border-white/20"
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-300 ${
                  showDarkNav ? "text-foreground" : "text-white"
                }`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link
                href="/"
                className={`flex items-center gap-2 text-xl font-bold transition-colors duration-300 ${
                  showDarkNav ? "text-foreground" : "text-white"
                }`}
              >
                <span className="logo-icon" />
                <span>Experidium</span>
              </Link>
            </div>

            <ul className="hidden items-center gap-8 md:flex">
              {siteConfig.nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`transition-colors duration-300 ${
                        isActive
                          ? showDarkNav
                            ? "text-[0.9375rem] font-semibold text-foreground"
                            : "text-[0.9375rem] font-semibold text-white"
                          : showDarkNav
                            ? "text-sm font-medium text-muted hover:text-foreground"
                            : "text-sm font-medium text-white/70 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:flex items-center gap-4 shrink-0">
              {!authUser ? (
                <Link
                  href="/login"
                  prefetch={false}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    showDarkNav
                      ? "text-muted hover:text-foreground"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  Log in
                </Link>
              ) : null}

              {showDarkNav ? (
                <Button variant="primary" onClick={() => setBookingOpen(true)}>
                  Book a 30-min call
                </Button>
              ) : (
                <button
                  type="button"
                  onClick={() => setBookingOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-200 px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-white active:bg-white"
                >
                  Book a 30-min call
                </button>
              )}

              {authUser ? (
                <UserMenu
                  user={authUser}
                  showDarkNav={showDarkNav}
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : null}
            </div>

            <div className="flex items-center gap-3 md:hidden shrink-0">
              {authUser ? (
                <UserMenu
                  user={authUser}
                  showDarkNav={showDarkNav}
                  isAdmin={isAdmin}
                  onNavigate={() => setMobileOpen(false)}
                />
              ) : (
                <Link
                  href="/login"
                  prefetch={false}
                  className={`text-sm font-medium ${
                    showDarkNav ? "text-foreground" : "text-white"
                  }`}
                >
                  Log in
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[60] bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-[70] h-full w-[280px] bg-white shadow-2xl md:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="logo-icon" />
                    <span>Experidium</span>
                  </Link>
                  <button
                    className="p-2 text-muted hover:text-foreground transition-colors"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-1 px-4 py-4 overflow-y-auto">
                  {siteConfig.nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-surface font-semibold text-foreground"
                          : "font-medium text-muted hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="px-4 pb-6 pt-2 border-t border-border space-y-2">
                  {authUser ? (
                    <>
                      <SignOutButton
                        className="w-full rounded-full border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface disabled:opacity-50"
                        onAfterSignOut={() => setMobileOpen(false)}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        href="/login"
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileOpen(false)}
                      >
                        Log in
                      </Button>
                      <Button
                        href="/signup"
                        variant="outline"
                        className="w-full"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign up
                      </Button>
                    </>
                  )}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setBookingOpen(true);
                    }}
                  >
                    Book a 30-min call
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CalendlyBookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        calendlyUrl={calendlyBookingUrl}
      />
    </>
  );
}
