import { Target, Brain, Users, Award } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import AnimatedImage from "@/components/ui/AnimatedImage";
import StatsSection from "@/components/sections/StatsSection";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "About — SolidRoutes",
  description: "The AI agency built exclusively for supply chain automation.",
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To give every mid-market supply chain company the autonomous AI capabilities that only Fortune 500 companies could afford — deployed fast, priced fairly, and designed to deliver measurable ROI from month one.",
  },
  {
    icon: Brain,
    title: "AI + Domain Expertise",
    text: "We combine cutting-edge AI engineering (CrewAI, LangGraph, Claude, GPT-4o) with deep supply chain domain knowledge — OTIF, MAPE, inventory turns, and the operational realities that pure-tech vendors miss.",
  },
  {
    icon: Users,
    title: "Built for Mid-Market",
    text: "Companies doing $10M–$100M in revenue can't afford 50-person data science teams. Our managed AI agents give you enterprise-grade capabilities at a fraction of the cost and complexity.",
  },
  {
    icon: Award,
    title: "Proven Results",
    text: "Every agent we deploy is measured on real business KPIs — forecast error reduction, procurement cycle time, disruption response speed, and carrying cost savings. No vanity metrics.",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Marcus Rivera", role: "CTO & Head of AI", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Priya Sharma", role: "Head of AI Engineering", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  { name: "James Okafor", role: "VP of Client Success", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <ScrollReveal>
              <SectionLabel>About Us</SectionLabel>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                The AI agency built exclusively for{" "}
                <span className="text-primary">supply chain</span>
              </h1>
              <p className="mt-6 text-muted leading-relaxed max-w-lg">
                SolidRoutes is an agentic AI implementation agency specializing in
                US mid-market supply chain companies. We build, deploy, and manage
                AI agents that autonomously handle the operational tasks your team
                shouldn&apos;t be doing manually — demand forecasting, procurement,
                disruption monitoring, and inventory optimization.
              </p>
              <div className="mt-8">
                <Button href="/contact">Get in touch</Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                <AnimatedImage
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="AI technology team"
                  effect="zoom-in"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <SectionLabel>Our Values</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">What drives us forward</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="rounded-[20px] border border-border bg-white p-8 text-center transition-all hover:border-foreground/20">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[10px] bg-surface text-foreground border border-border">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{v.text}</p>
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
              <SectionLabel>Our Team</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Meet the people behind the agents</h2>
            </div>
          </ScrollReveal>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group text-center">
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-[20px]">
                    <AnimatedImage
                      src={member.img}
                      alt={member.name}
                      effect="zoom-in"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{member.name}</h3>
                  <p className="text-sm text-muted">{member.role}</p>
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
