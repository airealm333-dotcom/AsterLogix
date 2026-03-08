"use client";

import Link from "next/link";
import { Brain, Twitter, Linkedin, Github } from "lucide-react";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Brain className="h-6 w-6 text-primary" />
              <span>AsterLogix</span>
            </Link>
            <p className="mb-6 text-sm text-white/60 leading-relaxed">
              We believe real transformation starts deep within the supply chain.
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-white/40 uppercase tracking-wider">Get supply chain AI insights.</span>
              <form className="mt-2 flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 rounded-full bg-card-dark px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary-dark"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Pages
            </h4>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.pages.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Address
            </h4>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.addresses.map((a, i) => (
                <li key={i} className="text-sm text-white/60 leading-relaxed">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h4>
            <ul className="mb-6 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${siteConfig.footer.email}`}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {siteConfig.footer.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.footer.phone}`}
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  {siteConfig.footer.phone}
                </a>
              </li>
            </ul>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
              Social media
            </h4>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card-dark text-white/60 border border-white/10 transition-all hover:bg-primary hover:text-foreground hover:border-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} AsterLogix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
