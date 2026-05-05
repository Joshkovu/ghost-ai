"use client";

import React, { createContext, useContext } from "react";
import { DialogType, Project } from "@/lib/hooks/use-project-dialogs";

interface ProjectActionsContextType {
  openDialog: (type: DialogType, project?: Project | null) => void;
}

const ProjectActionsContext = createContext<ProjectActionsContextType | undefined>(undefined);

export function ProjectActionsProvider({ 
  children, 
  openDialog 
}: { 
  children: React.ReactNode;
  openDialog: (type: DialogType, project?: Project | null) => void;
}) {
  return (
    <ProjectActionsContext.Provider value={{ openDialog }}>
      {children}
    </ProjectActionsContext.Provider>
  );
}

export function useProjectActions() {
  const context = useContext(ProjectActionsContext);
  if (context === undefined) {
    throw new Error("useProjectActions must be used within a ProjectActionsProvider");
  }
  return context;
}
