"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Link from "next/link";

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-surface-dark">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay — heavier on left for text readability, heavier on top for navbar */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 py-32 lg:py-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              AI agents that run your{" "}
              <span className="text-primary">supply chain</span> on autopilot
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/70 leading-relaxed">
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

          {/* Floating case study card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="hidden lg:flex justify-end"
          >
            <Link
              href="/case-studies/distributor-cuts-forecast-error-by-57-percent"
              className="block max-w-[280px] rounded-[20px] bg-white/10 p-6 backdrop-blur-xl border border-white/20 transition-all hover:bg-white/15 hover:border-white/30"
            >
              <p className="text-sm font-semibold leading-snug text-white">
                Distributor cuts forecast error by 57%
              </p>
              <div className="mt-4 flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={40} suffix="%" />
                  </p>
                  <p className="text-xs text-white/50">Error reduction</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    <AnimatedCounter value={60} suffix="s" />
                  </p>
                  <p className="text-xs text-white/50">Response time</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
