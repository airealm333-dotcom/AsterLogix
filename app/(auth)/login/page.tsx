import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="px-6 pt-32 text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
