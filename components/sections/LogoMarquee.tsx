"use client";

import Image from "next/image";

const logos = [
  { name: "SAP", src: "/logos/sap.svg", width: 72, height: 36 },
  { name: "Oracle", src: "/logos/oracle.svg", width: 100, height: 16 },
  { name: "NetSuite", src: "/logos/netsuite.svg", width: 100, height: 18 },
  { name: "Salesforce", src: "/logos/salesforce.svg", width: 36, height: 26 },
  { name: "Snowflake", src: "/logos/snowflake.svg", width: 30, height: 30 },
  { name: "Databricks", src: "/logos/databricks.svg", width: 30, height: 30 },
  { name: "AWS", src: "/logos/aws.svg", width: 60, height: 36 },
  { name: "Slack", src: "/logos/slack.svg", width: 30, height: 30 },
];

export default function LogoMarquee() {
  return (
    <section className="border-y border-border bg-white py-8 overflow-hidden">
      <div className="flex animate-marquee w-max gap-16">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="h-8 w-auto object-contain"
            />
            <span className="text-lg font-bold text-foreground/60">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
