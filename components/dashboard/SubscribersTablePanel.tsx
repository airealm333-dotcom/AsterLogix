"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Copy,
  Mail,
  Search,
} from "lucide-react";
import SubscriberTagsRow from "@/components/dashboard/SubscriberTagsRow";

export type SubscriberRow = {
  id: string;
  email: string;
  tags: string[];
  created_at: string | null;
};

type SortKey = "email" | "tags" | "joined";
type SortDir = "asc" | "desc";

/** ISO instant formatted in UTC — avoids hydration mismatch from locale/TZ (Node vs browser). */
function formatJoined(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  const s = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${min}:${s} UTC`;
}

function tagsSortValue(tags: string[]): string {
  return (tags ?? []).join(", ").toLowerCase();
}

export default function SubscribersTablePanel({
  rows,
  errorMessage,
  page,
  totalPages,
  count,
  prevHref,
  nextHref,
}: {
  rows: SubscriberRow[];
  errorMessage: string | null;
  page: number;
  totalPages: number;
  count: number;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir(key === "joined" ? "desc" : "asc");
      }
    },
    [sortKey]
  );

  const filteredSorted = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = rows.map((r) => ({ ...r, tags: r.tags ?? [] }));

    if (q) {
      list = list.filter((r) => {
        const emailMatch = r.email.toLowerCase().includes(q);
        const tagsMatch = tagsSortValue(r.tags).includes(q);
        return emailMatch || tagsMatch;
      });
    }

    const dir = sortDir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "email") {
        cmp = a.email.localeCompare(b.email, undefined, { sensitivity: "base" });
      } else if (sortKey === "tags") {
        cmp = tagsSortValue(a.tags).localeCompare(tagsSortValue(b.tags));
      } else {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        cmp = ta - tb;
      }
      return cmp * dir;
    });
  }, [rows, filter, sortKey, sortDir]);

  const copyEmail = useCallback(async (id: string, email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId((x) => (x === id ? null : x)), 2000);
    } catch {
      setCopiedId(null);
    }
  }, []);

  if (errorMessage) {
    return (
      <section aria-labelledby="dash-heading-subscribers">
        <h2
          id="dash-heading-subscribers"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Subscribers
        </h2>
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="dash-heading-subscribers">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2
          id="dash-heading-subscribers"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Subscribers
        </h2>
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by email or tags…"
            className="w-full rounded-lg border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none ring-offset-2 transition-shadow focus:border-foreground/30 focus:ring-2 focus:ring-primary/25"
            aria-label="Filter subscribers on this page"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">
        Filter and column sort apply to the current page only ({count} total in
        database).
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border-2 border-border bg-white shadow-sm outline outline-1 outline-border/60">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-surface">
              <SortableTh
                label="Email"
                active={sortKey === "email"}
                dir={sortDir}
                onSort={() => toggleSort("email")}
              />
              <SortableTh
                label="Tags"
                active={sortKey === "tags"}
                dir={sortDir}
                onSort={() => toggleSort("tags")}
              />
              <SortableTh
                label="Joined"
                active={sortKey === "joined"}
                dir={sortDir}
                onSort={() => toggleSort("joined")}
              />
              <th
                scope="col"
                className="border border-border px-3 py-3 text-center font-semibold text-foreground"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="border border-border px-3 py-8 text-center text-muted"
                >
                  {rows.length === 0
                    ? "No subscribers yet."
                    : "No rows match your filter."}
                </td>
              </tr>
            ) : (
              filteredSorted.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-border transition-colors hover:bg-surface/80 ${
                    i % 2 === 1 ? "bg-surface/40" : "bg-white"
                  }`}
                >
                  <td className="border border-border px-3 py-3 align-top font-medium text-foreground">
                    {row.email}
                  </td>
                  <td className="border border-border px-3 py-3 align-top">
                    <SubscriberTagsRow
                      subscriberId={row.id}
                      tags={row.tags}
                    />
                  </td>
                  <td className="border border-border px-3 py-3 align-top text-xs text-muted tabular-nums">
                    {formatJoined(row.created_at)}
                  </td>
                  <td className="border border-border px-3 py-3 align-top">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => void copyEmail(row.id, row.email)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-surface"
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        {copiedId === row.id ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={`mailto:${row.email}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-surface"
                      >
                        <Mail className="h-3.5 w-3.5" aria-hidden />
                        Email
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center rounded-lg border border-border bg-white px-4 py-2 font-medium text-foreground shadow-sm transition-colors hover:bg-surface"
          >
            Previous
          </Link>
        ) : null}
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded-lg border border-border bg-white px-4 py-2 font-medium text-foreground shadow-sm transition-colors hover:bg-surface"
          >
            Next
          </Link>
        ) : null}
        <span className="text-muted">
          Page {page} of {totalPages} ({count} total)
        </span>
      </div>
    </section>
  );
}

function SortableTh({
  label,
  active,
  dir,
  onSort,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onSort: () => void;
}) {
  const Icon = !active
    ? ArrowUpDown
    : dir === "asc"
      ? ArrowUp
      : ArrowDown;
  return (
    <th
      scope="col"
      className="border border-border px-0 py-0 font-semibold text-foreground"
    >
      <button
        type="button"
        onClick={onSort}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors hover:bg-surface/90"
        aria-sort={
          active ? (dir === "asc" ? "ascending" : "descending") : "none"
        }
      >
        <span>{label}</span>
        <Icon
          className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted opacity-50"}`}
          aria-hidden
        />
      </button>
    </th>
  );
}
