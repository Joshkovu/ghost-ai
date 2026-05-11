"use client";

import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShareProjectDialog } from "@/components/editor/share-project-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import { useProjectDialogs } from "@/lib/hooks/use-project-dialogs";
import type { ProjectListItem } from "@/lib/project-types";
import { cn } from "@/lib/utils";

interface EditorWorkspaceShellProps {
  projectId: string;
  projectName: string;
  isOwner: boolean;
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export function EditorWorkspaceShell({
  projectId,
  projectName,
  isOwner,
  ownedProjects,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const {
    activeDialog,
    selectedProject,
    isLoading,
    createProjectName,
    renameProjectName,
    createRoomIdPreview,
    openDialog,
    closeDialog,
    handleAction,
    setCreateProjectName,
    setRenameProjectName,
    submitActiveDialog,
  } = useProjectDialogs();

  return (
    <div className="flex min-h-screen flex-col bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((currentValue) => !currentValue)}
        projectName={projectName}
        onOpenShareDialog={() => setIsShareDialogOpen(true)}
        onToggleAiSidebar={() => setIsAiSidebarOpen((currentValue) => !currentValue)}
      />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        {/* Canvas fills the entire available space */}
        <CanvasWrapper roomId={projectId} />

        {/* Left Sidebar - Fixed overlay */}
        <div
          className={cn(
            "fixed left-0 top-[3.5rem] bottom-0 w-80 z-30 transition-transform duration-300 ease-in-out overflow-hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <ProjectSidebar
            isOpen={isSidebarOpen}
            variant="docked"
            onClose={() => setIsSidebarOpen(false)}
            myProjects={ownedProjects}
            sharedProjects={sharedProjects}
            activeProjectId={projectId}
            onOpenDialog={openDialog}
          />
        </div>

        {/* Right Sidebar - Fixed overlay */}
        <div
          className={cn(
            "fixed right-0 top-[3.5rem] bottom-0 w-80 z-30 transition-transform duration-300 ease-in-out overflow-hidden",
            isAiSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-full flex-col border-l border-surface-border bg-surface/88 backdrop-blur-sm">
            <div className="flex h-full flex-col rounded-none border-none bg-base/65 p-4 text-center">
              <div className="flex items-center justify-between border-b border-surface-border px-2 pb-4 text-left">
                <div>
                  <p className="text-sm font-semibold text-copy-primary">AI Copilot</p>
                  <p className="text-xs text-copy-faint">Placeholder panel</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand/30 bg-[linear-gradient(180deg,rgba(0,200,212,0.22),rgba(0,200,212,0.1))] text-brand shadow-[0_0_24px_rgba(0,200,212,0.18)]">
                  ✦
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-surface-border bg-elevated p-4 text-left shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <p className="text-sm font-semibold text-copy-primary">Chat surface pending</p>
                <p className="mt-1 text-sm leading-6 text-copy-secondary">
                  The toggle is wired. Messaging and generation are intentionally out of scope here.
                </p>
              </div>

              <div className="mt-auto rounded-2xl border border-dashed border-surface-border bg-base/50 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copy-faint">Future hooks</p>
                <p className="mt-2 text-sm leading-6 text-copy-secondary">
                  Prompt composer, run status, and architecture guidance will attach to this sidebar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProjectDialogs
        activeDialog={activeDialog}
        selectedProject={selectedProject}
        isLoading={isLoading}
        createProjectName={createProjectName}
        renameProjectName={renameProjectName}
        roomIdPreview={createRoomIdPreview}
        onClose={closeDialog}
        onAction={handleAction}
        onSubmit={submitActiveDialog}
        onCreateProjectNameChange={setCreateProjectName}
        onRenameProjectNameChange={setRenameProjectName}
      />

      <ShareProjectDialog
        open={isShareDialogOpen}
        projectId={projectId}
        isOwner={isOwner}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </div>
  );
}