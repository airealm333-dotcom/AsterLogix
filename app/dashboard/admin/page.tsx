import { redirect } from "next/navigation";

export default function LegacyDashboardAdminPage() {
  redirect("/create/newsletter");
}
