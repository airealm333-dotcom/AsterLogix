"use client";

import { useEffect, useId, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

type CalendlyBookingModalProps = {
  open: boolean;
  onClose: () => void;
  calendlyUrl: string;
};

/** Calendly inline embed URL (see Calendly embed docs). */
function calendlyEmbedUrl(pageUrl: string, embedHost: string): string {
  const u = new URL(pageUrl.trim());
  u.searchParams.set("embed_type", "Inline");
  u.searchParams.set("embed_domain", embedHost);
  return u.toString();
}

export default function CalendlyBookingModal({
  open,
  onClose,
  calendlyUrl,
}: CalendlyBookingModalProps) {
  const titleId = useId();
  const [iframeSrc, setIframeSrc] = useState("");

  useLayoutEffect(() => {
    if (!open) {
      setIframeSrc("");
      return;
    }
    setIframeSrc(
      calendlyEmbedUrl(calendlyUrl, window.location.host || "localhost")
    );
  }, [open, calendlyUrl]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="calendly-modal"
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close booking dialog"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-[101] flex w-full max-w-3xl flex-col overflow-hidden rounded-[20px] border border-border bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
              <div>
                <h2
                  id={titleId}
                  className="text-base font-bold text-foreground sm:text-lg"
                >
                  Book a 30-minute call
                </h2>
                <p className="mt-0.5 text-xs text-muted sm:text-sm">
                  Pick a time that works for you — powered by Calendly.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-[560px] w-full flex-1 bg-surface">
              {iframeSrc ? (
                <iframe
                  title="Calendly scheduling"
                  src={iframeSrc}
                  className="h-[min(70vh,720px)] w-full border-0"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-[min(70vh,720px)] items-center justify-center text-sm text-muted">
                  Loading calendar…
                </div>
              )}
            </div>
            <div className="border-t border-border px-4 py-3 text-center sm:px-5">
              <Link
                href="/contact"
                onClick={onClose}
                className="text-xs font-medium text-primary hover:underline sm:text-sm"
              >
                Prefer to send a message instead?
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
