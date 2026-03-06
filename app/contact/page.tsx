"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <SectionLabel>Contact Us</SectionLabel>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl max-w-3xl mx-auto">
              Let&apos;s build a{" "}
              <span className="text-primary">smarter supply chain</span> together
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              Ready to deploy AI agents that actually run your supply chain
              operations? Book a free assessment or send us a message — our team
              responds within 24 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <div>
                <h2 className="text-2xl font-bold">Get in touch</h2>
                <p className="mt-3 text-muted leading-relaxed">
                  Whether you have a question about our AI agents, pricing,
                  integrations, or partnerships, our team is ready to help.
                </p>

                <div className="mt-10 flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a href={`mailto:${siteConfig.footer.email}`} className="text-sm text-muted hover:text-foreground transition-colors">
                        {siteConfig.footer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <a href={`tel:${siteConfig.footer.phone}`} className="text-sm text-muted hover:text-foreground transition-colors">
                        {siteConfig.footer.phone}
                      </a>
                    </div>
                  </div>

                  {siteConfig.footer.addresses.map((addr, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Office {i + 1}</h3>
                        <p className="text-sm text-muted">{addr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-[20px] border border-border bg-surface p-8"
              >
                <h3 className="text-xl font-bold">Book a free AI assessment</h3>
                <p className="mt-2 text-sm text-muted">20 minutes. No commitment. Walk away knowing exactly where AI saves you money.</p>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">First name</label>
                      <input
                        type="text"
                        className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Last name</label>
                      <input
                        type="text"
                        className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Work email</label>
                    <input
                      type="email"
                      className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground transition-all"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Company &amp; role</label>
                    <input
                      type="text"
                      className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground transition-all"
                      placeholder="Acme Corp, VP of Operations"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Tell us about your supply chain challenges</label>
                    <textarea
                      rows={5}
                      className="w-full rounded-[10px] border border-border bg-white px-4 py-3 text-sm outline-none focus:border-foreground transition-all resize-none"
                      placeholder="What are your biggest operational pain points? Which systems (SAP, Oracle, NetSuite) do you use?"
                    />
                  </div>
                  <Button type="submit" className="w-full mt-2">
                    Book my assessment
                  </Button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
