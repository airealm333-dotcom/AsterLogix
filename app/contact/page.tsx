"use client";

import { MapPin, Mail, Phone, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ContactAssessmentForm from "@/components/contact/ContactAssessmentForm";
import { siteConfig } from "@/data/site";

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl max-w-3xl mx-auto">
              Let&apos;s build a{" "}
              <span className="text-primary">smarter supply chain</span> together
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              Ready to explore where AI fits your operations? Request a short
              discovery call or send a message — our team responds within one
              business day.
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
                      <a
                        href={`mailto:${siteConfig.footer.email}`}
                        className="text-sm text-muted hover:text-foreground transition-colors"
                      >
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
                      <a
                        href={`tel:${siteConfig.footer.phone.replace(/\s/g, "")}`}
                        className="text-sm text-muted hover:text-foreground transition-colors"
                      >
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
              <div className="flex flex-col gap-6">
                <ContactAssessmentForm />
                {bookingUrl ? (
                  <div className="rounded-[20px] border border-border bg-surface p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-foreground border border-border">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Prefer to pick a time?
                        </h3>
                        <p className="mt-1 text-sm text-muted leading-relaxed">
                          Book directly on our calendar — same conversation, no
                          extra forms.
                        </p>
                        <a
                          href={bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
                        >
                          Open scheduling link
                        </a>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
