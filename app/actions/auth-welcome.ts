"use server";

import { sendAppAccountWelcomeEmail } from "@/lib/email/send-app-welcome";

export async function sendPostSignupWelcomeEmail(
  email: string
): Promise<void> {
  await sendAppAccountWelcomeEmail(email);
}
