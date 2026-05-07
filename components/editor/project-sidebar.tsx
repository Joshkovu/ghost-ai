"use client";

import React from "react";
import { Plus, X, Edit2, Trash2, Folder } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogType, Project } from "@/lib/hooks/use-project-dialogs";
import Button from "@/components/ui/button";
import type { ProjectListItem } from "@/lib/project-types";

interface ProjectSidebarProps extends React.HTMLAttributes<HTMLElement> {
  isOpen: boolean;
  onClose?: () => void;
  myProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
  onOpenDialog: (type: DialogType, project?: Project | null) => void;
}

function ProjectItem({ 
  project, 
  onRename, 
  onDelete 
}: { 
  project: Project;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-surface-border hover:bg-subtle/50 hover:shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface border border-surface-border group-hover:border-brand/30 transition-colors">
          <Folder className="h-4 w-4 text-copy-secondary group-hover:text-brand transition-colors" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium text-copy-primary">
            {project.name}
          </span>
        </div>
      </div>

      {project.isOwner && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-copy-muted hover:bg-surface-border/50 hover:text-copy-primary transition-colors"
            title="Rename"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-copy-muted hover:bg-state-error/10 hover:text-state-error transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
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
  myProjects,
  sharedProjects,
  onOpenDialog,
  className,
  ...props
}: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[20rem] max-w-[calc(100vw-1rem)] transform-gpu flex-col border-r border-surface-border bg-surface/95 shadow-[16px_0_60px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-copy-faint">
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

      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4">
        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col gap-4 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex-1 overflow-y-auto pt-2">
            {myProjects.length > 0 ? (
              <div className="space-y-1">
                {myProjects.map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project} 
                    onRename={() => onOpenDialog("rename", project)}
                    onDelete={() => onOpenDialog("delete", project)}
                  />
                ))}
              </div>
            ) : (
              <EmptyProjectsState title="projects" />
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex-1 overflow-y-auto pt-2">
            {sharedProjects.length > 0 ? (
              <div className="space-y-1">
                {sharedProjects.map(project => (
                  <ProjectItem 
                    key={project.id} 
                    project={project}
                    onRename={() => onOpenDialog("rename", project)}
                    onDelete={() => onOpenDialog("delete", project)}
                  />
                ))}
              </div>
            ) : (
              <EmptyProjectsState title="shared projects" />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="border-t border-surface-border p-4">
        <Button
          variant="brand"
          className="w-full h-11"
          onClick={() => onOpenDialog("create")}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}

