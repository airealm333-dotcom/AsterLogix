import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CTASection from "@/components/sections/CTASection";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { sanitizeBlogHtml } from "@/lib/sanitize-html";

export const revalidate = 120;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const result = await getPostBySlug(slug);
  if (!result) {
    return { title: "Blog — Experidium", description: "" };
  }
  return {
    title: `${result.meta.title} — Experidium`,
    description: result.meta.excerpt,
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const blogPosts = await getAllPosts();
  const result = await getPostBySlug(slug);
  if (!result) notFound();

  const { meta: post, body } = result;
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? blogPosts[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < blogPosts.length - 1
      ? blogPosts[currentIndex + 1]
      : undefined;

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
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {body.format === "html" ? (
              <article
                className="prose prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{
                  __html: sanitizeBlogHtml(body.html),
                }}
              />
            ) : (
              <article className="prose prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted prose-p:leading-relaxed prose-li:text-muted prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                {body.node}
              </article>
            )}
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
