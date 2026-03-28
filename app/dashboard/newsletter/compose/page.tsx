import { redirect } from "next/navigation";

export const metadata = {
  title: "Newsletter — Experidium",
};

/** Compose UI lives on the main newsletter dashboard; keep URL for bookmarks. */
export default function NewsletterComposePage() {
  redirect("/create/newsletter");
}
