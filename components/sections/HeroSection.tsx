"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const handleReady = useCallback(() => setVideoReady(true), []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.readyState >= 2) {
      setVideoReady(true);
      return;
    }

    v.addEventListener("loadeddata", handleReady);
    v.addEventListener("canplay", handleReady);

    v.load();

    return () => {
      v.removeEventListener("loadeddata", handleReady);
      v.removeEventListener("canplay", handleReady);
    };
  }, [handleReady]);

  return (
    <section className="relative h-[72vh] min-h-[420px] sm:min-h-[520px] lg:min-h-[600px] bg-surface-dark">
      {/* Video + overlays clipped to section bounds */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content — overflows below the section so the card can extend past */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-6 pt-32 xl:pt-24 pb-0">
        <div className="mt-auto grid w-full items-end gap-12 lg:grid-cols-2">
          {/* Hero text — pushed up a bit from the very bottom */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pb-10 sm:pb-[4.5rem] lg:pb-14 xl:pb-20"
          >
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              AI agents that run your{" "}
              <span className="text-primary">supply chain</span> on autopilot
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg text-white/80 leading-relaxed">
              We build and deploy agentic AI systems that autonomously manage
              demand forecasting, procurement, disruption monitoring, and
              logistics — so your ops team stops fighting fires and starts
              running on strategy.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact">Book a Free AI Assessment</Button>
              <Button
                href="/service-static"
                variant="outline"
                className="!border-white/30 !text-white hover:!bg-white hover:!text-foreground"
              >
                See our agents
              </Button>
            </div>
          </motion.div>

          {/* Floating case study card — overflows below hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:flex justify-end xl:mb-[-116px]"
          >
            <Link
              href="/case-studies/distributor-cuts-forecast-error-by-57-percent"
              className="block w-[340px] xl:w-[392px] rounded-[20px] bg-white p-6 transition-all"
            >
              <p className="text-sm font-semibold leading-snug text-foreground">
                Distributor cuts forecast error by 57%
              </p>
              <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[12px]">
                <Image
                  src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80"
                  alt="AI supply chain dashboard"
                  fill
                  sizes="392px"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 divide-x divide-border">
                <div className="px-2 text-center">
                  <p className="text-xs text-muted leading-snug">
                    Error reduction
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    <AnimatedCounter value={40} suffix="%" />
                  </p>
                </div>
                <div className="px-2 text-center">
                  <p className="text-xs text-muted leading-snug">
                    Response time
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    <AnimatedCounter value={60} suffix="s" />
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
