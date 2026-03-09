export const siteConfig = {
  name: "SolidRoutes",
  tagline: "AI-Powered Supply Chain Automation",
  description:
    "We build and deploy agentic AI systems that autonomously manage demand forecasting, procurement, disruption monitoring, and logistics — so your operations team stops fighting fires and starts running on autopilot.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Case studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Contact us", href: "/contact" },
  ],
  footer: {
    pages: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/service-static" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy policy", href: "/privacy-policy" },
    ],
    addresses: [
      "123 Remote Work Avenue, San Francisco, CA 94105",
      "144 Creative Street, Suite 456, New York, NY 10001, USA",
    ],
    email: "hello@asterlogix.ai",
    phone: "+123 456 7890",
  },
  stats: [
    { value: 40, suffix: "%", label: "Avg. forecast error reduction" },
    { value: 29, suffix: "%", label: "Supply chain hours automated" },
    { value: 60, suffix: "s", label: "Autonomous disruption response" },
    { value: 94, suffix: "%", label: "Client retention rate" },
  ],
  industries: [
    {
      name: "Retail & E-commerce",
      description:
        "AI agents that predict seasonal demand spikes, automate replenishment, and optimize last-mile logistics for retailers and D2C brands.",
      features: [
        "AI-driven demand forecasting tuned for promotional and seasonal cycles.",
        "Automated reorder triggers integrated with your ERP and warehouse systems.",
        "Real-time inventory balancing across stores, warehouses, and fulfillment centers.",
        "Intelligent returns processing and reverse logistics automation.",
      ],
    },
    {
      name: "Manufacturing",
      description:
        "Predictive procurement, supplier risk scoring, and production planning agents that keep your lines running without excess inventory.",
      features: [
        "Predictive procurement agents that auto-generate POs based on demand signals.",
        "Supplier risk scoring with real-time monitoring of lead times and quality.",
        "Production scheduling optimization to minimize changeover and idle time.",
        "Automated raw material inventory balancing across multiple plants.",
      ],
    },
    {
      name: "Healthcare & Pharma",
      description:
        "Compliance-aware AI agents for cold-chain logistics, expiry management, and demand planning across sensitive pharmaceutical supply chains.",
      features: [
        "Demand forecasting tuned for regulatory approval cycles and tender schedules.",
        "Automated cold-chain monitoring with real-time deviation alerts.",
        "Expiry-aware inventory rotation and redistribution across locations.",
        "Supplier qualification automation with compliance document parsing.",
      ],
    },
    {
      name: "Food & Beverage",
      description:
        "Shelf-life-aware demand planning and procurement agents that cut waste, prevent stockouts, and optimize fresh product distribution.",
      features: [
        "Perishability-aware demand forecasting and replenishment automation.",
        "Dynamic route optimization for temperature-sensitive deliveries.",
        "Automated supplier evaluation for seasonal and regional sourcing.",
        "Waste reduction agents that redistribute near-expiry stock intelligently.",
      ],
    },
    {
      name: "Technology & Electronics",
      description:
        "Component-level supply chain intelligence — from semiconductor lead-time prediction to automated alternate-part sourcing.",
      features: [
        "Lead-time prediction for long-cycle components like semiconductors.",
        "Automated alternate-part sourcing when primary suppliers face delays.",
        "Multi-tier supplier visibility with disruption cascading analysis.",
        "Demand sensing from channel partner sell-through data and market signals.",
      ],
    },
  ],
  services: [
    {
      title: "Demand Forecasting Agent",
      description:
        "Cuts forecast error by 40–50% using ML models trained on your sales history, promotions, seasonality, and external signals — then auto-triggers replenishment.",
    },
    {
      title: "Disruption Monitoring Agent",
      description:
        "24/7 monitors suppliers, ports, weather, and tariff changes. Auto-escalates risks and re-routes orders before disruptions hit your bottom line.",
    },
    {
      title: "Procurement Automation Agent",
      description:
        "Evaluates suppliers, generates purchase orders, negotiates delivery windows, and manages approvals — autonomously and at scale.",
    },
    {
      title: "Inventory Optimization Agent",
      description:
        "Balances stock levels across every location in real time, preventing stockouts and overstock simultaneously while minimizing carrying costs.",
    },
    {
      title: "Visibility Dashboard",
      description:
        "A unified real-time view connecting your ERP, logistics partners, and supplier data into one intelligent screen with AI-generated insights.",
    },
  ],
  whyChooseUs: [
    {
      title: "Agentic AI, not generic AI",
      description:
        "Our agents don't just summarize data or draft emails. They detect a port delay in Vietnam, recalculate downstream inventory impact, re-route to a backup supplier, and update your ERP — all in under 60 seconds, zero human trigger.",
    },
    {
      title: "Deep supply chain expertise",
      description:
        "We speak OTIF, MAPE, DSO, and inventory turns fluently. Our team combines AI engineering with real supply chain domain knowledge — so our agents solve actual operational problems, not theoretical ones.",
    },
    {
      title: "Start small, scale fast",
      description:
        "Begin with a single agent solving your biggest pain point. Once you see the ROI, expand to a fully orchestrated system where demand forecasting feeds procurement, disruption monitoring triggers rerouting, and inventory balances itself.",
    },
  ],
  testimonials: [
    {
      name: "Rachel Kim",
      role: "VP of Operations, NovaTech Distribution",
      quote:
        "SolidRoutes cut our demand forecast error from 31% to 14% in six weeks. Our stockout rate dropped by 60% and we've freed up two full-time planners.",
    },
    {
      name: "Marcus Chen",
      role: "COO, Pacific Imports Group",
      quote:
        "When tariffs shifted overnight, their disruption agent had already flagged alternate suppliers and rerouted three critical shipments. That saved us over $400K.",
    },
    {
      name: "Sarah Okafor",
      role: "Director of Supply Chain, FreshField Foods",
      quote:
        "The procurement agent generates POs, validates pricing against historical benchmarks, and routes for approval — work that used to take my team 15 hours a week.",
    },
    {
      name: "David Morales",
      role: "CFO, Apex Manufacturing",
      quote:
        "We went from drowning in spreadsheets to a single dashboard showing real-time inventory, supplier risk scores, and predicted demand. The ROI was visible in month one.",
    },
    {
      name: "Emily Park",
      role: "Head of Logistics, UrbanShelf",
      quote:
        "Their inventory agent reduced our carrying costs by 28% while actually improving fill rates. I didn't think both were possible at the same time.",
    },
    {
      name: "James Thornton",
      role: "Supply Chain Director, MedLine Pharma",
      quote:
        "Compliance in pharma supply chain is brutal. SolidRoutes built agents that handle supplier qualification docs, expiry tracking, and cold-chain alerts — things we were doing manually across four systems.",
    },
  ],
  fleetFeatures: [
    "CrewAI & LangGraph multi-agent orchestration",
    "Claude & GPT-4o for reasoning and structured outputs",
    "SAP, Oracle, NetSuite & custom ERP integrations",
    "Real-time Slack/Teams alerting and dashboards",
    "Pinecone vector DB for supplier docs and contracts",
  ],
  offers: [
    {
      name: "AI Clarity Pack",
      price: "$3,500",
      period: "one-time",
      description:
        "A 25-page AI Readiness Assessment, Supply Chain Data Audit, and prioritized list of your 3 highest-ROI AI agent opportunities.",
      features: [
        "Complete supply chain data audit",
        "AI readiness scoring across 10 dimensions",
        "3 prioritized agent opportunities with ROI estimates",
        "Technology stack recommendations",
        "2-week delivery timeline",
      ],
    },
    {
      name: "Single Agent Deployment",
      price: "$2,500",
      period: "/month",
      setupPrice: "$18K–$25K setup",
      description:
        "One fully deployed AI agent integrated with your ERP, with 30-day hypercare and ongoing optimization.",
      features: [
        "Choice of any single agent module",
        "Full ERP integration (SAP, Oracle, NetSuite)",
        "30-day hypercare period included",
        "Monthly model retraining and performance monitoring",
        "Quarterly optimization reviews",
        "6–8 week deployment timeline",
      ],
    },
    {
      name: "Full Stack Agentic Supply Chain",
      price: "$4,500–$6K",
      period: "/month",
      setupPrice: "$35K–$55K setup",
      description:
        "3–5 integrated AI agents working as an orchestrated system with a unified visibility dashboard and dedicated support.",
      features: [
        "3–5 integrated agent modules",
        "Orchestrated multi-agent system",
        "Unified visibility dashboard",
        "Dedicated Slack channel for alerts",
        "Priority support and dedicated account manager",
        "10–14 week deployment timeline",
      ],
    },
  ],
};
