import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/session";

export const metadata = {
  title: "Newsletter — Experidium",
};

export default async function NewsletterApplyPage() {
  const session = await getSessionProfile();
  if (!session) redirect("/login");
  redirect("/");
}
