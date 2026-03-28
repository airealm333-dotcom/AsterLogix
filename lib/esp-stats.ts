export type BrevoAggregatedStats = {
  requests?: number;
  delivered?: number;
  opens?: number;
  clicks?: number;
  bounces?: number;
  softBounces?: number;
  hardBounces?: number;
};

export async function fetchBrevoAggregatedStats(): Promise<BrevoAggregatedStats | null> {
  const key = process.env.BREVO_API_KEY?.trim();
  if (!key) return null;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  const qs = new URLSearchParams({
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  });

  try {
    const res = await fetch(
      `https://api.brevo.com/v3/smtp/statistics/aggregatedReport?${qs}`,
      {
        headers: { accept: "application/json", "api-key": key },
        next: { revalidate: 0 },
      }
    );
    if (!res.ok) return null;
    return (await res.json()) as BrevoAggregatedStats;
  } catch {
    return null;
  }
}

/** Resend has no single aggregated marketing stats API in the same shape; return null. */
export async function fetchResendMarketingStats(): Promise<null> {
  return null;
}
