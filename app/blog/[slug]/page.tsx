import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { blogPosts } from "@/data/blogPosts";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    return {
      title: post ? `${post.title} — Experidium` : "Blog — Experidium",
      description: post?.excerpt ?? "",
    };
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prev = blogPosts[currentIndex - 1];
  const next = blogPosts[currentIndex + 1];

  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
            <SectionLabel>{post.category}</SectionLabel>
            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" /> {post.category}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] mb-12">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3 key={i} className="text-xl font-bold mt-8 mb-3">
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("**")) {
                  const parts = paragraph.split("**");
                  return (
                    <div key={i} className="mb-6">
                      <h3 className="text-xl font-bold mt-8 mb-3">{parts[1]}</h3>
                      <p className="text-muted leading-relaxed">{parts[2]}</p>
                    </div>
                  );
                }
                return (
                  <p key={i} className="text-muted leading-relaxed mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </ScrollReveal>

          <div className="mt-16 flex items-center justify-between border-t border-border pt-8">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors max-w-[45%]"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors max-w-[45%] text-right"
              >
                <span className="truncate">{next.title}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
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
