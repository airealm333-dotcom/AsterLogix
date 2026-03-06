"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Brain, Shield, ShoppingCart, Warehouse, BarChart3 } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";
import Link from "next/link";

const icons = [Brain, Shield, ShoppingCart, Warehouse, BarChart3];
const ITEMS_PER_PAGE = 4;

export default function ServicesSection() {
  const services = siteConfig.services;
  const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
  const [page, setPage] = useState(0);

  const visibleServices = services.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <SectionLabel>Our AI Agents</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Autonomous agents for every supply chain function
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-foreground hover:text-white hover:border-foreground"
                aria-label="Previous"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-foreground hover:text-white hover:border-foreground"
                aria-label="Next"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {visibleServices.map((service, i) => {
            const globalIndex = page * ITEMS_PER_PAGE + i;
            const Icon = icons[globalIndex % icons.length];
            return (
              <ScrollReveal key={globalIndex} delay={i * 0.08}>
                <Link
                  href="/service-static"
                  className="group flex items-center gap-6 py-6 transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface text-foreground transition-colors group-hover:bg-primary group-hover:text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold">{service.title}</h3>
                    <p className="mt-1 text-sm text-muted leading-relaxed line-clamp-1 sm:line-clamp-none">
                      {service.description}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 shrink-0 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    View detail
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
