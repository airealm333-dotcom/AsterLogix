import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SolidRoutes — AI-Powered Supply Chain Automation",
  description:
    "We build and deploy agentic AI systems that autonomously manage demand forecasting, procurement, disruption monitoring, and logistics for mid-market supply chain companies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/hero.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/hero-poster.jpg" as="image" />
      </head>
      <body
        className={`${instrumentSans.variable} ${inter.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
