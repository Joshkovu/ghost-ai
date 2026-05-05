"use client";

import React from "react";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectSidebarProps extends React.HTMLAttributes<HTMLElement> {
  isOpen: boolean;
  onClose?: () => void;
}

function EmptyProjectsState({ title }: { title: string }) {
  return (
    <div className="flex min-h-[11rem] flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-base px-4 text-center">
      <p className="text-sm font-medium text-copy-primary">No {title.toLowerCase()} yet</p>
      <p className="mt-1 max-w-[16rem] text-sm leading-6 text-copy-muted">
        Create a new project to start organizing editor workspaces.
      </p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
  ...props
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[19rem] max-w-[calc(100vw-1rem)] transform-gpu flex-col border-r border-surface-border bg-surface/95 shadow-[16px_0_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-copy-secondary">
          Projects
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close project sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-subtle text-copy-secondary transition-colors hover:text-copy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <Tabs defaultValue="my-projects" className="gap-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="pt-2">
            <EmptyProjectsState title="projects" />
          </TabsContent>

          <TabsContent value="shared" className="pt-2">
            <EmptyProjectsState title="shared projects" />
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t border-surface-border p-4">
        <button
          type="button"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/12 text-sm font-medium text-copy-primary transition-colors hover:border-brand/60 hover:bg-brand/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>
    </aside>
  );
}
