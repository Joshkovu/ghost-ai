import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  description: string;
  bullets: string[];
  children: ReactNode;
}

export function AuthShell({ title, description, bullets, children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="hidden border-r border-surface-border bg-surface px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-10">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.24em] text-copy-primary uppercase">
              Ghost AI
            </Link>

            <div className="max-w-sm space-y-4">
              <p className="text-3xl font-semibold leading-tight">{title}</p>
              <p className="max-w-md text-sm leading-7 text-copy-secondary">{description}</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm leading-6 text-copy-secondary">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}