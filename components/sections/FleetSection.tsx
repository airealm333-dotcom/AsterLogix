"use client";

import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { siteConfig } from "@/data/site";

export default function FleetSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
                Enterprise-grade AI infrastructure built for supply chain
              </h2>
              <div className="mt-8">
                <Button href="/service-static">Explore our stack</Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80"
                alt="AI technology infrastructure"
                effect="zoom-in"
              />
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80"
                alt="AI multi-agent orchestration"
                effect="reveal"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <p className="text-muted leading-relaxed">
                Our technology stack is purpose-built for supply chain
                complexity — multi-agent orchestration, deep ERP integrations,
                and real-time monitoring that keeps your operations running 24/7.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {siteConfig.fleetFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
