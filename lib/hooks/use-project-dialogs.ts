"use client";

import { useState, useCallback } from "react";

export type DialogType = "create" | "rename" | "delete" | null;

export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

export function useProjectDialogs() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = useCallback((type: DialogType, project: Project | null = null) => {
    setSelectedProject(project);
    setActiveDialog(type);
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedProject(null);
  }, []);

  const handleAction = useCallback(async (action: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
      closeDialog();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [closeDialog]);

  return {
    activeDialog,
    selectedProject,
    isLoading,
    openDialog,
    closeDialog,
    handleAction,
  };
}
