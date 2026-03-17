"use client";

import { Brain, Zap, Bot, Sun } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";

const badges = [
  { icon: Brain, label: "Demand forecasting" },
  { icon: Zap, label: "Disruption response" },
  { icon: Bot, label: "Autonomous procurement" },
];

const images = [
  { src: "/pexels-tiger-lily-4483772.jpg", alt: "Supply chain logistics" },
  { src: "/pexels-tima-miroshnichenko-6169060.jpg", alt: "AI warehouse automation" },
  { src: "/pexels-web-buz-29454379.jpg", alt: "Smart logistics operations" },
];

export default function DrivingChangeSection() {
  return (
    <section className="py-20 lg:py-24 xl:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <ScrollReveal>
          <div className="text-center">
            <Sun className="mx-auto h-8 w-8 text-muted/60" strokeWidth={1} />
            <SectionLabel>Driving Change</SectionLabel>
            <h2 className="mt-4 text-[1.75rem] font-normal leading-[1.35] tracking-tight sm:text-[2rem] lg:text-[2.25rem] xl:text-[2.5rem] lg:leading-[1.3] max-w-2xl mx-auto text-foreground">
              At Experidium, we are{" "}
              <span className="text-primary italic">replacing</span>{" "}
              <span className="font-semibold">manual workflows</span> with
              agentic AI across{" "}
              <span className="text-primary italic">every</span> supply chain.
            </h2>
          </div>
        </ScrollReveal>

        {/* Staggered image gallery */}
        <div className="mt-16 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:gap-7 px-4">
          <ScrollReveal delay={0}>
            <div className="group relative w-full max-w-[280px] sm:w-[240px] lg:w-[280px] aspect-[3/4] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src={images[0].src}
                alt={images[0].alt}
                effect="zoom-in"
                sizes="(max-width: 640px) 280px, 240px"
                className="transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="rounded-[24px] border-[2.5px] border-primary p-1.5">
              <div className="group relative w-full max-w-[280px] sm:w-[240px] lg:w-[280px] aspect-[3/4] overflow-hidden rounded-[20px]">
                <AnimatedImage
                  src={images[1].src}
                  alt={images[1].alt}
                  effect="zoom-in"
                  sizes="(max-width: 640px) 280px, 240px"
                  className="transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="group relative w-full max-w-[280px] sm:w-[240px] lg:w-[280px] aspect-[3/4] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src={images[2].src}
                alt={images[2].alt}
                effect="slide-up"
                sizes="(max-width: 640px) 280px, 240px"
                className="transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* CTA button — own row */}
        <ScrollReveal>
          <div className="mt-14 flex justify-center">
            <Button href="/about">More about us</Button>
          </div>
        </ScrollReveal>

        {/* Icon + label badges — separate row */}
        <ScrollReveal>
          <div className="mt-10 flex flex-wrap items-start justify-center gap-6 sm:gap-10 lg:gap-16">
            {badges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2.5">
                <Icon className="h-6 w-6 text-muted" strokeWidth={1.5} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
