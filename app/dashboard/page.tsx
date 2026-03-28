import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";

export default async function DashboardHomePage() {
  const session = await getSessionProfile();
  if (session && isAdmin(session.profile.role)) {
    redirect("/create/newsletter");
  }
  redirect("/");
}
