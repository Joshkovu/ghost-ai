"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/lib/hooks/use-project-dialogs";
import { ProjectActionsProvider } from "@/lib/context/project-actions-context";
import { cn } from "@/lib/utils";
import type { ProjectListItem } from "@/lib/project-types";


interface EditorShellProps {
  children: ReactNode;
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export function EditorShell({ children, ownedProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="min-h-screen bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((currentValue) => !currentValue)}
      />

      {/* Mobile Sidebar Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-30 bg-base/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        myProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onOpenDialog={openDialog}
      />

      <ProjectActionsProvider openDialog={openDialog}>
        <main className="min-h-[calc(100vh-3.5rem)] px-4 py-8">{children}</main>
      </ProjectActionsProvider>

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
    </div>
  );
}

