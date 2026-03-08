import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { caseStudies } from "@/data/caseStudies";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const cs = caseStudies.find((c) => c.slug === slug);
    return {
      title: cs ? `${cs.title} — AsterLogix` : "Case Study — AsterLogix",
      description: cs?.excerpt ?? "",
    };
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  const currentIndex = caseStudies.findIndex((c) => c.slug === slug);
  const prev = caseStudies[currentIndex - 1];
  const next = caseStudies[currentIndex + 1];

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to case studies
            </Link>
            <SectionLabel>Case Study</SectionLabel>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl max-w-4xl">
              {cs.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-4">
              {cs.metrics.map((m, i) => (
                <div key={i} className="rounded-[10px] bg-white border border-border px-3 py-2 sm:px-5 sm:py-3">
                  <span className="text-xl sm:text-2xl font-bold text-primary">{m.value}</span>
                  <p className="text-xs text-muted mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] mb-12">
              <Image src={cs.image} alt={cs.title} fill className="object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="prose prose-lg max-w-none">
              {cs.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollReveal>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
            {prev ? (
              <Link
                href={`/case-studies/${prev.slug}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> {prev.title}
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/case-studies/${next.slug}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                {next.title} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
