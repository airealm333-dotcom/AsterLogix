"use client";

import { Quote } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/data/site";

export default function TestimonialsSection() {
  const testimonials = siteConfig.testimonials;

  return (
    <section className="py-20 lg:py-28 bg-surface overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              What our clients say
            </h2>
            <p className="mt-3 text-muted">
              Real results from real supply chain AI deployments
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-12 flex gap-6 animate-marquee w-max">
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="w-[min(350px,calc(100vw-3rem))] shrink-0 rounded-[20px] bg-white p-5 sm:p-8 border border-border"
          >
            <Quote className="h-8 w-8 text-muted/20" />
            <p className="mt-4 text-sm text-muted leading-relaxed italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-foreground font-bold text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
