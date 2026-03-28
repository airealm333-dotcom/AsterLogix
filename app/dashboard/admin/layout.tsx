import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";

export default async function AdminSectionLayout({
  children: _children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionProfile();
  if (session && isAdmin(session.profile.role)) {
    redirect("/create/newsletter");
  }
  redirect("/");
}
