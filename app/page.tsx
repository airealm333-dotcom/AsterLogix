import HeroSection from "@/components/sections/HeroSection";
import DrivingChangeSection from "@/components/sections/DrivingChangeSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import StatsSection from "@/components/sections/StatsSection";
import FleetSection from "@/components/sections/FleetSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CaseStudiesPreview from "@/components/sections/CaseStudiesPreview";
import CTASection from "@/components/sections/CTASection";
import BlogPreview from "@/components/sections/BlogPreview";
import LogoMarquee from "@/components/sections/LogoMarquee";
import { getAllPosts } from "@/lib/blog";

export default async function Home() {
  const blogPosts = await getAllPosts();

  return (
    <>
      <HeroSection />
      <DrivingChangeSection />
      <IndustriesSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <StatsSection />
      <FleetSection />
      <TestimonialsSection />
      <CaseStudiesPreview />
      <CTASection />
      <BlogPreview posts={blogPosts} />
      <LogoMarquee />
    </>
  );
}
