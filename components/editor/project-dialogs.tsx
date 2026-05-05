"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

import Dialog, {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { DialogType, Project } from "@/lib/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  selectedProject: Project | null;
  isLoading: boolean;
  onClose: () => void;
  onAction: (action: () => Promise<void>) => void;
}

export function ProjectDialogs({
  activeDialog,
  selectedProject,
  isLoading,
  onClose,
  onAction,
}: ProjectDialogsProps) {
  if (!activeDialog) return null;

  return (
    <Dialog open={!!activeDialog} onClose={onClose}>
      <DialogContent>
        <ProjectDialogContent
          key={`${activeDialog}-${selectedProject?.id || "new"}`}
          activeDialog={activeDialog}
          selectedProject={selectedProject}
          isLoading={isLoading}
          onClose={onClose}
          onAction={onAction}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProjectDialogContent({
  activeDialog,
  selectedProject,
  isLoading,
  onClose,
  onAction,
}: ProjectDialogsProps) {
  const [projectName, setProjectName] = useState(
    activeDialog === "rename" ? selectedProject?.name || "" : ""
  );

  const slug = (activeDialog === "create" || activeDialog === "rename")
    ? projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() && activeDialog !== "delete") return;

    onAction(async () => {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`${activeDialog} project:`, projectName || selectedProject?.name);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {activeDialog === "create" && (
        <>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Start a new architecture workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium text-copy-muted uppercase tracking-wider">
                Project Name
              </label>
              <Input
                id="name"
                placeholder="E.g. Ghost AI Core"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                required
              />
              {slug && (
                <p className="text-[11px] text-copy-faint">
                  URL Slug: <span className="text-brand">ghost.ai/editor/{slug}</span>
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {activeDialog === "rename" && (
        <>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Current name: <span className="font-medium text-copy-primary">{selectedProject?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="rename-name" className="text-xs font-medium text-copy-muted uppercase tracking-wider">
                New Name
              </label>
              <Input
                id="rename-name"
                placeholder="E.g. New Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>
        </>
      )}

      {activeDialog === "delete" && (
        <>
          <DialogHeader>
            <DialogTitle className="text-state-error">Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-copy-primary">{selectedProject?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 flex items-center gap-3 text-sm text-copy-secondary bg-state-error/5 rounded-xl mx-6 mb-2">
            <AlertCircle className="h-4 w-4 text-state-error" />
            All diagrams and documents in this project will be permanently removed.
          </div>
        </>
      )}

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant={activeDialog === "delete" ? "destructive" : "brand"}
          disabled={isLoading || (activeDialog !== "delete" && !projectName.trim())}
        >
          {isLoading ? "Processing..." : activeDialog === "create" ? "Create Project" : activeDialog === "rename" ? "Save Changes" : "Delete Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}
