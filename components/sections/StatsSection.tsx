"use client";

import { Leaf } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";

export default function StatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-dark text-white">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <SectionLabel>Impact In Numbers</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl max-w-2xl mx-auto">
              Measurable results across every agent deployment, integration, and
              client partnership.
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="rounded-[20px] bg-card-dark p-5 sm:p-8 border border-white/10">
                <p className="text-sm text-white/60">{stat.label}</p>
                <div className="my-3">
                  <Leaf className="h-5 w-5 text-primary/60" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-primary">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
