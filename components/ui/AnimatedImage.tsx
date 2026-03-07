"use client";

import { motion, useInView, type Variants } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type AnimatedImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  effect?: "zoom-in" | "slide-up" | "reveal" | "ken-burns";
};

const variantMap: Record<string, Variants> = {
  "zoom-in": {
    hidden: { scale: 1.15, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
  },
  "slide-up": {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  },
  reveal: {
    hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    visible: { clipPath: "inset(0% 0 0 0)", opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  "ken-burns": {
    hidden: { scale: 1.2, opacity: 0 },
    visible: { scale: 1.05, opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
  },
};

export default function AnimatedImage({
  src,
  alt,
  fill = true,
  priority = false,
  sizes,
  className = "",
  containerClassName = "",
  effect = "zoom-in",
}: AnimatedImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${containerClassName}`}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variantMap[effect]}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          priority={priority}
          sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
          className={`object-cover ${className}`}
        />
      </motion.div>
    </div>
  );
}
