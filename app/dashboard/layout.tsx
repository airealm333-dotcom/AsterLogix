import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { getSessionProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";

  const session = await getSessionProfile();
  if (!session) {
    const supabase = await createClient();
    const {
      data: { session: cookieSession },
    } = await supabase.auth.getSession();
    if (cookieSession?.user) {
      redirect("/missing-profile");
    }
    redirect("/");
  }

  /** Admin-only in-app hub (Vercel links); bypass redirect to `/create/newsletter`. */
  const isAnalyticsHub =
    pathname === "/dashboard/analytics" ||
    pathname.startsWith("/dashboard/analytics/");
  if (isAnalyticsHub) {
    if (!isAdmin(session.profile.role)) {
      redirect("/");
    }
    return <>{children}</>;
  }

  if (isAdmin(session.profile.role)) {
    redirect("/create/newsletter");
  }
  redirect("/");
}
