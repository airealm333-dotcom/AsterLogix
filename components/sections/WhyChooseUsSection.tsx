"use client";

import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { siteConfig } from "@/data/site";

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <ScrollReveal>
              <SectionLabel>Why SolidRoutes</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Why SolidRoutes is the smarter choice
              </h2>
            </ScrollReveal>

            <div className="mt-10 flex flex-col gap-8">
              {siteConfig.whyChooseUs.map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="mt-10">
                <Button href="/about">Meet our team</Button>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src="/pexels-instasky-12951630.jpg"
                alt="AI technology dashboard"
                effect="ken-burns"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
