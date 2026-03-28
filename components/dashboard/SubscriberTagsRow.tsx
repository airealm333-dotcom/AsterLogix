"use client";

import { useActionState, useState } from "react";
import { updateSubscriberTagsForm } from "@/app/actions/newsletter-dashboard";
import Button from "@/components/ui/Button";

const initial = { ok: false, message: "" };

export default function SubscriberTagsRow({
  subscriberId,
  tags,
}: {
  subscriberId: string;
  tags: string[];
}) {
  const [value, setValue] = useState(tags.join(", "));
  const [state, formAction, pending] = useActionState(
    updateSubscriberTagsForm,
    initial
  );

  return (
    <form action={formAction} className="flex flex-col gap-1">
      <input type="hidden" name="subscriber_id" value={subscriberId} />
      <input
        name="tags_csv"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded border border-border px-2 py-1 text-xs"
        placeholder="comma, separated, tags"
      />
      {state.message ? (
        <span
          className={
            state.ok ? "text-xs text-green-600" : "text-xs text-red-600"
          }
        >
          {state.message}
        </span>
      ) : null}
      <Button type="submit" variant="ghost" className="!px-2 !py-1 !text-xs self-start" disabled={pending}>
        {pending ? "…" : "Save tags"}
      </Button>
    </form>
  );
}
