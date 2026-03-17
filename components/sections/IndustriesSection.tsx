"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { siteConfig } from "@/data/site";

const industryImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80",
];

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const industry = siteConfig.industries[active];

  return (
    <section className="py-20 lg:py-24 xl:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <SectionLabel>Industries We Serve</SectionLabel>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl max-w-2xl mx-auto">
              Building smarter, cleaner supply chains across diverse industries
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {siteConfig.industries.map((ind, i) => (
              <button
                key={ind.name}
                onClick={() => setActive(i)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  active === i
                    ? "bg-foreground text-white"
                    : "bg-white text-muted border border-border hover:border-foreground/30"
                }`}
              >
                {ind.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="mt-12 grid gap-10 lg:grid-cols-2 items-center"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <AnimatedImage
                src={industryImages[active]}
                alt={industry.name}
                effect="zoom-in"
                className="transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold">{industry.name}</h3>
              <p className="mt-3 text-muted leading-relaxed">
                {industry.description}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {industry.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
