"use client";

import React from "react";
import { PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

interface EditorNavbarProps extends React.HTMLAttributes<HTMLElement> {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  onToggleAiSidebar?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  onToggleAiSidebar,
  className,
  ...props
}: EditorNavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center border-b border-surface-border bg-surface/95 px-3 backdrop-blur-sm md:px-4",
        className,
      )}
      {...props}
    >
      <div className="flex w-56 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-subtle text-copy-secondary transition-colors hover:text-copy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        {projectName ? (
          <div className="text-center leading-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-copy-faint">
              Workspace
            </p>
            <h1 className="mt-1 truncate text-sm font-semibold text-copy-primary md:text-base">
              {projectName}
            </h1>
          </div>
        ) : null}
      </div>

      <div className="clerk-user-button-white flex w-56 items-center justify-end gap-2">
        {projectName ? (
          <>
            <button
              type="button"
              onClick={() => undefined}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-surface-border bg-subtle px-3 text-xs font-medium text-copy-secondary transition-colors hover:text-copy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              type="button"
              onClick={onToggleAiSidebar}
              aria-label="Toggle AI chat"
              className="inline-flex h-10 items-center rounded-xl border border-brand/40 bg-[linear-gradient(180deg,rgba(0,200,212,0.28),rgba(0,200,212,0.16))] px-3 text-xs font-semibold text-brand shadow-[0_10px_30px_rgba(0,200,212,0.14)] transition-colors hover:border-brand/60 hover:bg-[linear-gradient(180deg,rgba(0,200,212,0.36),rgba(0,200,212,0.18))] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/70"
            >
              AI chat
            </button>
          </>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}
