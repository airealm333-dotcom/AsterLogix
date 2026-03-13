import Image from "next/image";
import { Brain, Shield, ShoppingCart, Warehouse, BarChart3, CheckCircle2, Check } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import StatsSection from "@/components/sections/StatsSection";
import CTASection from "@/components/sections/CTASection";
import { siteConfig } from "@/data/site";

export const metadata = {
  title: "Services — Experidium",
  description: "AI agents and pricing for supply chain automation.",
};

const agentDetails = [
  {
    icon: Brain,
    title: "Demand Forecasting Agent",
    description:
      "ML models trained on your sales history, promotions, seasonality, and external signals. Generates SKU-location-week forecasts and auto-triggers replenishment when inventory hits dynamically calculated reorder points.",
    features: [
      "40–50% average forecast error reduction",
      "Automated replenishment trigger integration",
      "Weekly retraining on fresh data",
      "Anomaly detection with confidence thresholds",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80",
  },
  {
    icon: Shield,
    title: "Disruption Monitoring Agent",
    description:
      "Continuously scans supplier health, port congestion, weather, tariff announcements, and geopolitical signals. Maps disruptions to your active orders and generates response plans in under 60 seconds.",
    features: [
      "24/7 monitoring of 50+ data feeds",
      "Real-time impact analysis per PO and customer",
      "Auto-generated rerouting proposals",
      "One-click approval via Slack or Teams",
    ],
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=700&q=80",
  },
  {
    icon: ShoppingCart,
    title: "Procurement Automation Agent",
    description:
      "Evaluates suppliers based on historical performance, generates purchase orders, validates pricing against benchmarks, and routes approvals — autonomously processing thousands of POs monthly.",
    features: [
      "Automated PO generation from demand signals",
      "Supplier scoring on price, quality, and reliability",
      "Maverick spend detection and prevention",
      "99%+ PO accuracy rate",
    ],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80",
  },
  {
    icon: Warehouse,
    title: "Inventory Optimization Agent",
    description:
      "Balances stock levels across every location in real time, dynamically adjusting safety stocks and reorder points based on demand signals, lead time variability, and supplier reliability.",
    features: [
      "Dynamic safety stock optimization",
      "Multi-location inventory balancing",
      "15–28% carrying cost reduction",
      "Simultaneous stockout and overstock prevention",
    ],
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80",
  },
  {
    icon: BarChart3,
    title: "Supply Chain Visibility Dashboard",
    description:
      "A unified real-time view connecting your ERP, logistics partners, and supplier data into one intelligent screen with AI-generated insights, alerts, and recommended actions.",
    features: [
      "Real-time unified data from ERP, TMS, and WMS",
      "AI-generated insights and anomaly alerts",
      "Supplier risk scorecards",
      "Custom KPI tracking and reporting",
    ],
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=700&q=80",
  },
];

export default function ServiceStaticPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <SectionLabel>Our Services</SectionLabel>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl max-w-3xl mx-auto">
              AI agents & solutions for{" "}
              <span className="text-primary">supply chain automation</span>
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              From demand forecasting to disruption monitoring, we deploy
              autonomous AI agents that integrate with your existing ERP and
              deliver measurable ROI from month one.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-24">
            {agentDetails.map((agent, i) => (
              <ScrollReveal key={i}>
                <div className="grid items-center gap-12 lg:grid-cols-2">
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
                      <agent.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-2xl font-bold sm:text-3xl">{agent.title}</h2>
                    <p className="mt-4 text-muted leading-relaxed">{agent.description}</p>
                    <ul className="mt-6 flex flex-col gap-3">
                      {agent.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button href="/contact">Get started</Button>
                    </div>
                  </div>
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[20px] ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <Image src={agent.image} alt={agent.title} fill className="object-cover" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-3 text-muted max-w-2xl mx-auto">
                Start with an assessment, deploy a single agent, or go full
                stack. Every engagement is designed to prove ROI before you scale.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {siteConfig.offers.map((offer, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  className={`relative rounded-[20px] border p-8 transition-all hover:border-foreground/20 ${
                    i === 2
                      ? "border-foreground bg-white"
                      : "border-border bg-white"
                  }`}
                >
                  {i === 2 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{offer.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{offer.price}</span>
                    <span className="text-muted text-sm">{offer.period}</span>
                  </div>
                  {"setupPrice" in offer && offer.setupPrice && (
                    <p className="mt-1 text-sm text-muted">{offer.setupPrice}</p>
                  )}
                  <p className="mt-4 text-sm text-muted leading-relaxed">
                    {offer.description}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {offer.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant={i === 2 ? "primary" : "outline"}
                      className="w-full"
                    >
                      {i === 0 ? "Get your assessment" : "Start deployment"}
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </>
  );
}
