import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/roles";
import { getSessionProfile } from "@/lib/auth/session";

export const metadata = {
  title: "Write — Experidium",
};

/** Legacy URL: blog publishing lives in the admin dashboard. */
export default async function WriteBlogsPage() {
  const session = await getSessionProfile();
  if (session && isAdmin(session.profile.role)) {
    redirect("/create/newsletter?tab=blog");
  }
  redirect("/blog");
}
