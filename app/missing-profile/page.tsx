import Link from "next/link";
import SignOutButton from "@/components/dashboard/SignOutButton";

export const metadata = {
  title: "Account setup — Experidium",
};

export default function MissingProfilePage() {
  const showDevHelp =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_SETUP_HELP === "1";

  return (
    <main className="mx-auto max-w-md px-6 pt-32 pb-24">
      <h1 className="text-2xl font-bold text-foreground">Account setup incomplete</h1>
      <p className="mt-3 text-sm text-muted leading-relaxed">
        We could not finish loading your account. Try signing out, refreshing the page,
        and signing in again. If the problem continues, contact support.
      </p>

      {showDevHelp ? (
        <details className="mt-6 rounded-xl border border-border bg-surface/50 p-4 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">
            Developer / project setup
          </summary>
          <p className="mt-3 text-muted leading-relaxed">
            Ensure the Supabase schema is applied and verified:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            <li>
              Run{" "}
              <code className="text-[11px] text-foreground">
                supabase/sql/auth_rbac_newsletter.sql
              </code>{" "}
              in the SQL Editor (includes <code className="text-[11px]">ensure_my_profile</code>{" "}
              at the end).
            </li>
            <li>
              Only if you use an old DB without that RPC:{" "}
              <code className="text-[11px] text-foreground">
                supabase/sql/ensure_my_profile_rpc.sql
              </code>
            </li>
            <li>
              Set <code className="text-[11px]">SUPABASE_SERVICE_ROLE_KEY</code> in{" "}
              <code className="text-[11px]">.env.local</code>, then run{" "}
              <code className="text-[11px]">npm run verify:supabase</code> and confirm the
              printed project ref matches your Supabase dashboard.
            </li>
            <li>
              If <code className="text-[11px]">profiles</code> exists but your user has no row,
              run{" "}
              <code className="text-[11px]">supabase/sql/backfill_profiles_from_auth.sql</code>{" "}
              in the SQL Editor.
            </li>
            <li>
              If logs mention <strong className="text-foreground">infinite recursion</strong> on{" "}
              <code className="text-[11px]">profiles</code>, run{" "}
              <code className="text-[11px]">supabase/sql/fix_profiles_rls_recursion.sql</code>.
            </li>
          </ul>
          <p className="mt-2 text-xs text-muted">
            In production, set{" "}
            <code className="text-[11px]">NEXT_PUBLIC_SHOW_SETUP_HELP=1</code> to show this
            block for operators.
          </p>
        </details>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SignOutButton className="rounded-full border border-border bg-transparent px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface disabled:opacity-50" />
        <Link
          href="/"
          className="text-center text-sm font-medium text-primary hover:underline sm:text-left"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
