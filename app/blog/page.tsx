import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 120;

export const metadata = {
  title: "Blog — Experidium",
  description:
    "Insights on agentic AI, supply chain automation, and the future of operations.",
};

export default async function BlogPage() {
  const blogPosts = await getAllPosts();

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <SectionLabel>Our Blog</SectionLabel>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl max-w-3xl mx-auto">
              Insights for{" "}
              <span className="text-primary">AI-powered</span> supply chains
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              Practical strategies, real deployment stories, and expert
              perspectives on the future of agentic AI in supply chain
              operations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[20px] border border-border transition-all hover:border-foreground/20">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
                        <span className="rounded-full border border-border bg-white px-3 py-1 font-medium text-foreground">
                          {post.category}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="h-4 w-4" />
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
