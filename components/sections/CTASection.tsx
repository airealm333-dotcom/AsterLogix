"use client";

import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-24 xl:py-28 bg-surface-dark">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-4xl xl:text-5xl">
                Ready to put your supply chain on autopilot?
              </h2>
              <p className="mt-4 text-white/60 leading-relaxed">
                Book a free 20-minute AI readiness assessment. We&apos;ll map
                your biggest supply chain pain points to the AI agents that
                solve them — with real ROI estimates specific to your business.
              </p>
              <div className="mt-8">
                <Button
                  href="/contact"
                  className="!bg-primary !text-foreground hover:!bg-primary-dark"
                >
                  Book a Discovery Call
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80"
                alt="AI-powered supply chain dashboard"
                effect="ken-burns"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
