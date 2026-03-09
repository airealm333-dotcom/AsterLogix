export interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  metrics: { value: string; label: string }[];
  content: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "distributor-cuts-forecast-error-by-57-percent",
    title: "How a $50M distributor cut forecast error from 31% to 14%",
    excerpt:
      "NovaTech Distribution deployed SolidRoutes's Demand Forecasting Agent across 12 product categories — slashing forecast error, reducing stockouts by 60%, and freeing two full-time planners.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    metrics: [
      { value: "57%", label: "Forecast error reduction" },
      { value: "60%", label: "Fewer stockout incidents" },
    ],
    content: `NovaTech Distribution, a $50M consumer electronics distributor, relied on spreadsheet-based demand planning across 12 product categories and 200+ SKUs. Their demand planning team of three spent most of their time manually adjusting forecasts that were consistently 25-35% off actual demand — leading to chronic stockouts on fast-movers and excess inventory on slow-movers.

SolidRoutes deployed a Demand Forecasting Agent trained on three years of NovaTech's sales history, combined with external signals including promotional calendars, competitor pricing data, and macroeconomic indicators. The agent generates weekly demand forecasts at the SKU-location level and automatically triggers replenishment orders when inventory hits dynamically calculated reorder points.

Within the first six weeks, forecast MAPE (Mean Absolute Percentage Error) dropped from 31% to 14%. Stockout incidents fell by 60%, while excess inventory carrying costs decreased by $180K annually. Two of the three demand planners were reassigned to higher-value strategic sourcing work. The forecasting agent now runs autonomously, retraining monthly on fresh data and alerting the operations team only when anomalies exceed confidence thresholds.

NovaTech has since expanded to SolidRoutes's Procurement Automation Agent and is evaluating the full stack deployment for Q1 2027.`,
  },
  {
    slug: "manufacturer-automates-procurement-cycle",
    title: "Automating procurement for a mid-market manufacturer",
    excerpt:
      "Apex Manufacturing deployed SolidRoutes's Procurement Agent to evaluate suppliers, generate POs, and manage approvals — cutting procurement cycle time by 40% and eliminating $320K in annual maverick spend.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    metrics: [
      { value: "40%", label: "Faster procurement cycles" },
      { value: "$320K", label: "Maverick spend eliminated" },
    ],
    content: `Apex Manufacturing, a $75M precision parts manufacturer serving the automotive and aerospace industries, had a procurement process that was almost entirely manual. Purchase requisitions were emailed between departments, supplier evaluation happened in spreadsheets, and PO generation required three levels of manual approval — a process that averaged 8.5 days from request to order.

SolidRoutes deployed a Procurement Automation Agent that integrates directly with Apex's SAP ECC system. The agent monitors inventory levels and production schedules, automatically generates purchase orders when materials are needed, evaluates suppliers based on historical performance (price, quality scores, lead time reliability), and routes approvals through Slack with one-click authorization.

The results were immediate. Average procurement cycle time dropped from 8.5 days to 5.1 days — a 40% reduction. More importantly, the agent eliminated $320K in annual maverick spend by enforcing approved supplier lists and negotiated pricing automatically. The procurement team went from spending 70% of their time on transactional PO processing to focusing on strategic supplier relationship management and cost negotiation.

The agent processes approximately 1,200 purchase orders per month with a 99.2% accuracy rate. Apex is now in the expansion phase, adding the Inventory Optimization Agent to create an integrated procurement-inventory system.`,
  },
  {
    slug: "disruption-monitoring-saves-2m-rerouting",
    title: "Real-time disruption monitoring saved $2M in rerouting costs",
    excerpt:
      "When tariffs shifted and a key port faced congestion, SolidRoutes's Disruption Agent had already flagged alternate suppliers and rerouted three critical shipments for Pacific Imports Group.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
    metrics: [
      { value: "$2M", label: "Saved in potential losses" },
      { value: "60s", label: "Average disruption response time" },
    ],
    content: `Pacific Imports Group, a $90M importer and distributor sourcing from 45 suppliers across Southeast Asia, was hit hard by the 2026 tariff increases. With US effective import tariffs at 22% — the highest since the early 1900s — every disruption in their supply chain had outsized financial consequences. Their operations team was monitoring supplier status, port conditions, and regulatory changes manually across email, news alerts, and phone calls.

SolidRoutes deployed a Disruption Monitoring Agent that continuously scans supplier health signals, port congestion data, weather patterns, tariff announcements, and geopolitical risk feeds. The agent maps every data point against Pacific Imports' active purchase orders and inventory positions, calculating downstream financial impact in real time.

The system proved its value within the first month. When congestion at a major Vietnamese port threatened three high-value shipments worth $1.8M in landed cost, the agent detected the delay signal 14 hours before Pacific Imports' logistics team would have learned about it through traditional channels. It automatically identified two alternate suppliers in Thailand with available capacity, generated cost comparison analyses, and drafted rerouting proposals — all within 60 seconds of the initial alert.

The operations team approved the rerouting with a single click in Slack, and the shipments arrived only 3 days late instead of the projected 3-week delay. The total savings from avoided production line shutdowns, emergency air freight, and customer penalties exceeded $2M in the first quarter alone.

Pacific Imports now runs the full SolidRoutes stack: Disruption Monitoring, Procurement Automation, and the Visibility Dashboard — giving their 8-person operations team capabilities that previously would have required 20+ analysts.`,
  },
];
