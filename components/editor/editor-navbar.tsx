"use client";

import React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

interface EditorNavbarProps extends React.HTMLAttributes<HTMLElement> {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  className,
  ...props
}: EditorNavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center border-b border-surface-border bg-surface/95 px-4 backdrop-blur-sm",
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

      <div className="flex flex-1 items-center justify-center" />

      <div className="flex w-56 items-center justify-end">
        <UserButton />
      </div>
    </header>
  );
}
