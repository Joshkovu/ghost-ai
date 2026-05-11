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

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[20rem_minmax(0,1fr)_20rem]">
        <div className={cn("hidden min-h-0 md:block", isSidebarOpen ? "md:block" : "md:hidden")}>
          <ProjectSidebar
            isOpen={true}
            variant="docked"
            onClose={() => setIsSidebarOpen(false)}
            myProjects={ownedProjects}
            sharedProjects={sharedProjects}
            activeProjectId={projectId}
            onOpenDialog={openDialog}
          />
        </div>

        <main className="min-h-0 overflow-hidden p-3 md:p-4">
          <div className="relative flex min-h-[calc(100vh-7.5rem)] rounded-[28px] border border-surface-border overflow-hidden shadow-[0_24px_120px_rgba(0,0,0,0.38)]">
            <CanvasWrapper roomId={projectId} />
          </div>
        </main>

        <aside className={cn("hidden min-h-0 md:block", isAiSidebarOpen ? "md:block" : "md:hidden") }>
          <div className="flex h-full flex-col border-l border-surface-border bg-surface/88 p-4 backdrop-blur-sm">
            <div className="flex h-full flex-col rounded-[28px] border border-surface-border bg-base/65 p-4 text-center shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
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
        </aside>
      </div>

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