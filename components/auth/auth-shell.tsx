import Link from "next/link";
import type { ReactNode } from "react";
import { FileText, Share2, Sparkles } from "lucide-react";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  const features = [
    {
      icon: Sparkles,
      title: "AI Architecture Generation",
      detail: "Describe your system, AI maps it to nodes and edges on a live canvas.",
    },
    {
      icon: Share2,
      title: "Real-time Collaboration",
      detail: "Live cursors, presence indicators, and shared node editing across your team.",
    },
    {
      icon: FileText,
      title: "Instant Spec Generation",
      detail: "Export a complete Markdown technical spec directly from the canvas graph.",
    },
  ];

  return (
    <div className="min-h-screen bg-base text-copy-primary">
      <div className="grid min-h-screen lg:grid-cols-[1.03fr_1fr]">
        <aside className="hidden border-r border-surface-border bg-[linear-gradient(180deg,#0f1020_0%,#0c0d17_100%)] px-14 py-12 lg:flex lg:flex-col">
          <div className="max-w-lg space-y-14">
            <Link href="/" className="inline-flex items-center gap-3 text-lg font-semibold text-copy-primary">
              <span className="h-7 w-7 rounded-md bg-gradient-to-br from-cyan-300 to-cyan-500" />
              Ghost AI
            </Link>

            <div className="max-w-lg space-y-6 pt-10">
              <p className="text-5xl font-semibold leading-[1.1] tracking-tight">{title}</p>
              <p className="max-w-xl text-xl leading-8 text-copy-secondary">{description}</p>
            </div>

            <ul className="space-y-8 pt-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <li key={feature.title} className="flex items-start gap-4">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border bg-subtle text-brand">
                      <Icon className="h-4.5 w-4.5" />
                    </span>

                    <div className="space-y-1.5">
                      <p className="text-[1.24rem] font-medium leading-6 text-copy-primary">{feature.title}</p>
                      <p className="text-base leading-6 text-copy-muted">{feature.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="pt-12 pl-auto w-full max-w-lg shrink-0 border-t border-surface-border-subtle pt-6 text-left text-sm text-copy-faint">
            © 2026 Ghost AI. All rights reserved.
          </p>
        </aside>

        <main className="relative flex items-center justify-center bg-[#07070d] px-4 py-10 sm:px-6 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,200,212,0.07),transparent_35%)]" />

          <div className="auth-card-host relative z-10 w-full max-w-[470px]">{children}</div>
        </main>
      </div>
    </div>
  );
}