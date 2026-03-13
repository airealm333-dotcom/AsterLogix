import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { blogPosts } from "@/data/blogPosts";

export const metadata = {
  title: "Blog — Experidium",
  description: "Insights on agentic AI, supply chain automation, and the future of operations.",
};

export default function BlogPage() {
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
          {blogPosts[0] && (
            <ScrollReveal>
              <Link href={`/blog/${blogPosts[0].slug}`} className="group block">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                    <Image
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span className="rounded-full border border-border bg-white px-3 py-1 font-medium text-foreground text-xs">
                        {blogPosts[0].category}
                      </span>
                      <span>{blogPosts[0].date}</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-bold sm:text-3xl group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="mt-3 text-muted leading-relaxed">{blogPosts[0].excerpt}</p>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post, i) => (
              <ScrollReveal key={post.slug} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[20px] border border-border transition-all hover:border-foreground/20">
                    <div className="relative aspect-[16/10]">
                      <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="rounded-full border border-border bg-white px-3 py-1 font-medium text-foreground">
                          {post.category}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
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
