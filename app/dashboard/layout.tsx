import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children: _children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionProfile();
  if (!session) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/missing-profile");
    }
    redirect("/");
  }

  if (isAdmin(session.profile.role)) {
    redirect("/create/newsletter");
  }
  redirect("/");
}
