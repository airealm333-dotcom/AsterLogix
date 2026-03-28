/**
 * Brevo (formerly Sendinblue) — optional ESP sync for newsletter subscribers.
 * https://developers.brevo.com/reference/createcontact
 *
 * Set BREVO_API_KEY and BREVO_LIST_IDS (comma-separated numeric list IDs) in `.env.local`.
 */
export function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY?.trim());
}

function parseListIds(): number[] {
  const raw = process.env.BREVO_LIST_IDS?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n));
}

/**
 * Adds or updates a contact and subscribes them to configured lists.
 * Does not throw — logs errors for observability.
 */
export async function syncSubscriberToBrevo(email: string): Promise<void> {
  if (!isBrevoConfigured()) return;

  const apiKey = process.env.BREVO_API_KEY!.trim();
  const listIds = parseListIds();

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: listIds.length > 0 ? listIds : undefined,
        updateEnabled: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Brevo API error:", res.status, text);
    }
  } catch (e) {
    console.error("Brevo sync failed:", e);
  }
}
