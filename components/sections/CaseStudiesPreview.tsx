"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudiesPreview() {
  const featured = caseStudies.slice(0, 2);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <SectionLabel>Case Studies</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                AI-powered results — impactful case studies from our
                clients
              </h2>
            </div>
            <Button href="/case-studies" variant="outline">
              See all case studies
            </Button>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {featured.map((cs, i) => (
            <ScrollReveal key={cs.slug} delay={i * 0.15}>
              <Link href={`/case-studies/${cs.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                  <AnimatedImage
                    src={cs.image}
                    alt={cs.title}
                    effect={i === 0 ? "zoom-in" : "reveal"}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{cs.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-4">
                      {cs.metrics.map((m, j) => (
                        <div key={j}>
                          <span className="text-lg font-bold text-primary">
                            {m.value}
                          </span>
                          <span className="ml-1 text-xs text-white/70">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Read case study <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
