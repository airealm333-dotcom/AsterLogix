"use client";

const logos = [
  "SAP",
  "Oracle",
  "NetSuite",
  "Salesforce",
  "Snowflake",
  "Databricks",
  "AWS",
  "Slack",
];

export default function LogoMarquee() {
  return (
    <section className="border-y border-border bg-white py-8 overflow-hidden">
      <div className="flex animate-marquee w-max gap-16">
        {[...logos, ...logos].map((name, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-lg font-bold text-foreground/20 whitespace-nowrap"
          >
            <div className="h-8 w-8 rounded-[8px] bg-foreground/5" />
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
