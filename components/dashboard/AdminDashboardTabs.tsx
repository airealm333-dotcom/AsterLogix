"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { FileText, Mail, Users, type LucideIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DASHBOARD_TABS,
  type AdminDashboardTabId,
} from "@/lib/dashboard-tabs";

export type { AdminDashboardTabId } from "@/lib/dashboard-tabs";

const TAB_ICONS: Record<AdminDashboardTabId, LucideIcon> = {
  newsletter: Mail,
  blog: FileText,
  subscribers: Users,
};

const tabListClass =
  "inline-flex min-w-max gap-1 rounded-xl border border-border bg-surface p-1 shadow-sm sm:min-w-0 sm:w-full sm:max-w-full";

const tabButtonBase =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:scale-[0.98] sm:flex-1 sm:px-4";

const tabButtonInactive =
  "text-muted hover:bg-white/70 hover:text-foreground";

const tabButtonActive =
  "bg-white text-foreground shadow-sm ring-1 ring-border/60";

const panelShellClass =
  "rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5";

export default function AdminDashboardTabs({
  defaultTab,
  panels,
}: {
  defaultTab: AdminDashboardTabId;
  panels: Record<AdminDashboardTabId, ReactNode>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = useState<AdminDashboardTabId>(defaultTab);
  const [visited, setVisited] = useState<Set<AdminDashboardTabId>>(
    () => new Set([defaultTab])
  );

  useEffect(() => {
    setActive(defaultTab);
    setVisited((prev) => new Set([...prev, defaultTab]));
  }, [defaultTab]);

  const applyTabToUrl = useCallback(
    (tab: AdminDashboardTabId) => {
      const next = new URLSearchParams(searchParams.toString());
      if (tab === "newsletter") {
        next.delete("tab");
      } else {
        next.set("tab", tab);
      }
      if (tab !== "subscribers") {
        next.delete("page");
      }
      if (tab !== "blog") {
        next.delete("edit");
      }
      const q = next.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const selectTab = useCallback(
    (tab: AdminDashboardTabId) => {
      setActive(tab);
      setVisited((prev) => new Set([...prev, tab]));
      applyTabToUrl(tab);
    },
    [applyTabToUrl]
  );

  const tabIds = useMemo(() => DASHBOARD_TABS.map((t) => t.id), []);

  return (
    <div className="mt-6">
      <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] sm:mx-0 sm:overflow-visible sm:px-0">
        <div
          role="tablist"
          aria-label="Dashboard sections"
          className={tabListClass}
        >
          {DASHBOARD_TABS.map(({ id, label }) => {
            const selected = active === id;
            const Icon = TAB_ICONS[id];
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`dash-tab-${id}`}
                aria-selected={selected}
                aria-controls={`dash-panel-${id}`}
                tabIndex={selected ? 0 : -1}
                className={`${tabButtonBase} ${
                  selected ? tabButtonActive : tabButtonInactive
                }`}
                onClick={() => selectTab(id)}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {tabIds.map((id) => {
          if (!visited.has(id)) return null;
          const hidden = active !== id;
          return (
            <div
              key={id}
              id={`dash-panel-${id}`}
              role="tabpanel"
              aria-labelledby={`dash-tab-${id}`}
              hidden={hidden}
            >
              <div className={panelShellClass}>{panels[id]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
