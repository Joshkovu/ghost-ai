import Link from "next/link";
import { Lock } from "lucide-react";

export function AccessDenied() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-surface-border bg-surface/80 px-6 py-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-base text-copy-secondary">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-copy-primary">Access denied</h1>
        <p className="mt-3 text-sm leading-6 text-copy-secondary">
          You do not have access to this workspace, or it no longer exists.
        </p>
        <Link
          href="/editor"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Back to editor
        </Link>
      </div>
    </section>
  );
}