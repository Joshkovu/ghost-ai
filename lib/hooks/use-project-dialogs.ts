"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createRoomId, createRoomSuffix } from "@/lib/project-room";

export type DialogType = "create" | "rename" | "delete" | null;

export interface Project {
  id: string;
  name: string;
  isOwner: boolean;
}

export function useProjectDialogs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [createProjectName, setCreateProjectName] = useState("");
  const [createRoomIdSeed, setCreateRoomIdSeed] = useState(() => createRoomSuffix());
  const [renameProjectName, setRenameProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createRoomIdPreview = useMemo(
    () => createRoomId(createProjectName.trim() || "Untitled Project", createRoomIdSeed),
    [createProjectName, createRoomIdSeed],
  );

  const openDialog = useCallback((type: DialogType, project: Project | null = null) => {
    setSelectedProject(project);
    if (type === "create") {
      setCreateProjectName("");
      setCreateRoomIdSeed(createRoomSuffix());
      setRenameProjectName("");
    }

    if (type === "rename") {
      setRenameProjectName(project?.name ?? "");
      setCreateProjectName("");
    }

    if (type === "delete") {
      setCreateProjectName("");
      setRenameProjectName("");
    }

    setActiveDialog(type);
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedProject(null);
    setCreateProjectName("");
    setRenameProjectName("");
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

  const submitActiveDialog = useCallback(async () => {
    if (activeDialog === "create") {
      const name = createProjectName.trim() || "Untitled Project";

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          roomId: createRoomIdPreview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const createdProject = await response.json();

      closeDialog();
      router.replace(`/editor?projectId=${createdProject.id}&roomId=${createdProject.roomId ?? createRoomIdPreview}`);
      router.refresh();
      return;
    }

    if (activeDialog === "rename") {
      if (!selectedProject) {
        throw new Error("No project selected");
      }

      const name = renameProjectName.trim();

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename project");
      }

      closeDialog();
      router.refresh();
      return;
    }

    if (activeDialog === "delete") {
      if (!selectedProject) {
        throw new Error("No project selected");
      }

      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const activeProjectId = searchParams.get("projectId");

      closeDialog();

      if (activeProjectId === selectedProject.id) {
        router.replace("/editor");
      }

      router.refresh();
    }
  }, [activeDialog, closeDialog, createProjectName, createRoomIdPreview, renameProjectName, router, searchParams, selectedProject]);

  return {
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
  };
}
