"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { blogPosts } from "@/data/blogPosts";
import useEmblaCarousel from "embla-carousel-react";

export default function BlogPreview() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <SectionLabel>Our Blog</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Insights for smarter supply chain operations
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-foreground hover:text-white hover:border-foreground"
                aria-label="Previous"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-foreground hover:text-white hover:border-foreground"
                aria-label="Next"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {blogPosts.map((post, i) => (
              <div
                key={post.slug}
                className="min-w-0 flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                    <AnimatedImage
                      src={post.image}
                      alt={post.title}
                      effect={i % 2 === 0 ? "zoom-in" : "slide-up"}
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-4">
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
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
