import ScrollReveal from "@/components/ui/ScrollReveal";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata = {
  title: "Privacy Policy — Experidium",
  description: "Our commitment to protecting your privacy and data.",
};

const sections = [
  {
    title: "Information We Collect",
    text: "We collect information you provide directly to us, such as when you fill out a contact form, book an AI assessment, subscribe to our newsletter, or request a quote. This may include your name, email address, phone number, company name, role, and details about your supply chain operations and technology stack.",
  },
  {
    title: "How We Use Your Information",
    text: "We use the information we collect to provide, maintain, and improve our services, communicate with you about our AI agent offerings, respond to your inquiries, and send you relevant updates about supply chain AI automation. We will never sell your personal information to third parties.",
  },
  {
    title: "Data Security",
    text: "We implement industry-standard security measures to protect your personal information and any supply chain data shared during assessments or deployments. All client data is encrypted in transit and at rest. We regularly review and update our security practices to ensure the highest level of protection.",
  },
  {
    title: "Client Data and AI Agents",
    text: "When deploying AI agents for your supply chain operations, we may process operational data including demand history, purchase orders, supplier information, and inventory levels. This data is used exclusively for training and operating your AI agents and is never shared with other clients or used for any purpose beyond your engagement.",
  },
  {
    title: "Cookies and Tracking",
    text: "We use cookies and similar tracking technologies to enhance your experience on our website, analyze site traffic, and understand where our visitors come from. You can control cookie preferences through your browser settings.",
  },
  {
    title: "Third-Party Services",
    text: "We may share your information with trusted third-party service providers who assist us in operating our website and delivering our services (e.g., cloud infrastructure providers, CRM systems), so long as those parties agree to keep this information confidential and comply with applicable data protection regulations.",
  },
  {
    title: "Your Rights",
    text: "You have the right to access, correct, or delete your personal information at any time. You may also opt out of marketing communications by clicking the unsubscribe link in our emails or contacting us directly.",
  },
  {
    title: "Changes to This Policy",
    text: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. We encourage you to review this page periodically.",
  },
  {
    title: "Contact Us",
    text: "If you have any questions about this Privacy Policy or our data practices, please contact us at contact@experidium.com or call us at +91 6238411405.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-background">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <ScrollReveal>
            <SectionLabel>Legal</SectionLabel>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-muted max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy outlines how we collect,
              use, and protect your information.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-6">
          <div className="flex flex-col gap-12">
            {sections.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div>
                  <h2 className="text-xl font-bold">{s.title}</h2>
                  <p className="mt-3 text-muted leading-relaxed">{s.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
