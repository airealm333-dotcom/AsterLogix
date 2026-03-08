"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Brain } from "lucide-react";
import { siteConfig } from "@/data/site";
import Button from "@/components/ui/Button";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            scrolled ? "pt-2" : "pt-4"
          }`}
        >
          <nav
            className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-3 transition-all duration-300 ${
              scrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg"
                : "bg-transparent border border-white/20"
            }`}
          >
            <div className="flex items-center gap-1">
              <button
                className={`md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-300 ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              <Link
                href="/"
                className={`flex items-center gap-2 text-xl font-bold transition-colors duration-300 ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
              >
                <Brain className="h-6 w-6 text-primary" />
                <span>AsterLogix</span>
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
                          ? scrolled
                            ? "text-[0.9375rem] font-semibold text-foreground"
                            : "text-[0.9375rem] font-semibold text-white"
                          : scrolled
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

            <div className="hidden md:block">
              {scrolled ? (
                <Button href="/contact" variant="primary">
                  Book AI Assessment
                </Button>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-200 px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-white active:bg-white"
                >
                  Book AI Assessment
                </Link>
              )}
            </div>

            <div className="md:hidden w-[44px]" />
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
                    <Brain className="h-6 w-6 text-primary" />
                    <span>AsterLogix</span>
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

                <div className="px-4 pb-6 pt-2 border-t border-border">
                  <Button
                    href="/contact"
                    variant="primary"
                    className="w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    Book AI Assessment
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
