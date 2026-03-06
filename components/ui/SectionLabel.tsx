"use client";

export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-border bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted">
      {children}
    </span>
  );
}
