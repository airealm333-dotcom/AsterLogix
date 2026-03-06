"use client";

import { Brain, Zap, Bot } from "lucide-react";
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
  { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80", effect: "zoom-in" as const },
  { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", effect: "reveal" as const },
  { src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80", effect: "slide-up" as const },
];

export default function DrivingChangeSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <SectionLabel>Why Agentic AI</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl max-w-3xl mx-auto">
              From chatbots that suggest to agents that act — AI systems that
              autonomously manage your supply chain.
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="group relative aspect-[3/4] overflow-hidden rounded-[20px]">
                <AnimatedImage
                  src={img.src}
                  alt="AI automation"
                  effect={img.effect}
                  className="transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button href="/about">Learn more about us</Button>
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5"
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
