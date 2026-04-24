import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { isAdmin } from "@/lib/auth/roles";
import { getSessionProfile } from "@/lib/auth/session";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  title: "Experidium — AI-Powered Supply Chain Automation",
  description:
    "We build and deploy agentic AI systems that autonomously manage demand forecasting, procurement, disruption monitoring, and logistics for mid-market supply chain companies.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

/** Strips Cursor IDE `data-cursor-element-id` before React hydrates (injected into the DOM and causes mismatches). */
const stripCursorElementIdsScript = `
(function(){
  function strip(){
    try{
      document.querySelectorAll("[data-cursor-element-id]").forEach(function(el){
        el.removeAttribute("data-cursor-element-id");
      });
    }catch(e){}
  }
  strip();
  if(typeof MutationObserver!=="undefined")return;
  new MutationObserver(strip).observe(document.documentElement,{
    subtree:true,
    childList:true,
    attributes:true,
    attributeFilter:["data-cursor-element-id"]
  });
})();
`.trim();

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getSessionProfile();
  const initialIsAdmin = session ? isAdmin(session.profile.role) : false;
  const copyrightYear = new Date().getUTCFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/hero.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/hero-poster.jpg" as="image" />
      </head>
      <body
        className={`${instrumentSans.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{ __html: stripCursorElementIdsScript }}
        />
        <Header initialIsAdmin={initialIsAdmin} />
        <main className="min-h-screen">{children}</main>
        <Footer copyrightYear={copyrightYear} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
