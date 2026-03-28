"use client";

import { useTransition } from "react";
import {
  approveNewsletterApplicant,
  rejectNewsletterApplicant,
} from "@/app/actions/admin-writers";
import Button from "@/components/ui/Button";

type Row = {
  id: string;
  user_id: string;
  reason: string;
  portfolio: string | null;
  created_at: string;
  profiles: { email: string } | null;
};

export default function AdminNewsletterAppsClient({
  applications,
}: {
  applications: Row[];
}) {
  const [pending, startTransition] = useTransition();

  if (!applications.length) {
    return (
      <p className="mt-4 text-sm text-muted">No pending newsletter applications.</p>
    );
  }

  return (
    <ul className="mt-4 space-y-6">
      {applications.map((a) => (
        <li
          key={a.id}
          className="rounded-xl border border-border bg-white p-4 text-sm"
        >
          <p className="font-medium text-foreground">
            {a.profiles?.email ?? a.user_id}
          </p>
          <p className="mt-2 text-muted whitespace-pre-wrap">{a.reason}</p>
          {a.portfolio ? (
            <p className="mt-2">
              <a
                href={a.portfolio}
                className="text-primary text-xs break-all"
                target="_blank"
                rel="noreferrer"
              >
                {a.portfolio}
              </a>
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  approveNewsletterApplicant(a.user_id).then(() =>
                    window.location.reload()
                  )
                )
              }
            >
              Approve
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() =>
                startTransition(() =>
                  rejectNewsletterApplicant(a.user_id).then(() =>
                    window.location.reload()
                  )
                )
              }
            >
              Reject
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
