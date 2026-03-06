import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { caseStudies } from "@/data/caseStudies";

export const metadata = {
  title: "Case Studies — AsterLogix",
  description: "Real results from AI agent deployments in mid-market supply chain companies.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <SectionLabel>Case Studies</SectionLabel>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl max-w-3xl mx-auto">
              AI agents delivering{" "}
              <span className="text-primary">measurable ROI</span>
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              Real before-and-after results from autonomous AI agent deployments
              across mid-market supply chain companies.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <ScrollReveal key={cs.slug} delay={i * 0.1}>
                <Link href={`/case-studies/${cs.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[20px] border border-border transition-all hover:border-foreground/20">
                    <div className="relative aspect-[16/10]">
                      <Image src={cs.image} alt={cs.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{cs.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-4">
                        {cs.metrics.map((m, j) => (
                          <div key={j} className="text-sm">
                            <span className="font-bold text-primary">{m.value}</span>
                            <span className="ml-1 text-muted">{m.label}</span>
                          </div>
                        ))}
                      </div>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:gap-2 transition-all">
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

      <CTASection />
    </>
  );
}
