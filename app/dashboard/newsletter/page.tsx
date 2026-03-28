import { redirect } from "next/navigation";

export default function LegacyDashboardNewsletterPage() {
  redirect("/create/newsletter");
}
