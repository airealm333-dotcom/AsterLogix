export type AdminDashboardTabId = "newsletter" | "blog" | "subscribers";

export const DASHBOARD_TABS: { id: AdminDashboardTabId; label: string }[] = [
  { id: "newsletter", label: "Newsletter" },
  { id: "blog", label: "Blog" },
  { id: "subscribers", label: "Subscribers" },
];

function isTabId(v: string | null | undefined): v is AdminDashboardTabId {
  return v === "newsletter" || v === "blog" || v === "subscribers";
}

export function parseDashboardTab(
  raw: string | string[] | undefined
): AdminDashboardTabId {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v && isTabId(v)) return v;
  return "newsletter";
}
