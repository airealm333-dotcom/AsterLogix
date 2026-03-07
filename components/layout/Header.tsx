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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`mx-auto max-w-7xl px-4 transition-all duration-300 ${
          scrolled ? "pt-2" : "pt-4"
        }`}
      >
        <nav
          className={`flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300 ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-transparent border border-white/20"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-2 text-xl font-bold transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            <Brain className="h-6 w-6 text-primary" />
            <span>AsterLogix</span>
          </Link>

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

          <button
            className={`md:hidden p-2 transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-b-[20px] bg-white shadow-lg mx-2 md:hidden"
            >
              <div className="flex flex-col gap-4 px-6 py-6">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors hover:text-foreground ${
                      pathname === item.href
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button href="/contact" variant="primary" className="mt-2 w-full">
                  Book AI Assessment
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
