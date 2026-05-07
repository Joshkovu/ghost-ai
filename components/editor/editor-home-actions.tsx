"use client";

import { Plus } from "lucide-react";

import Button from "@/components/ui/button";
import { useProjectActions } from "@/lib/context/project-actions-context";

export function EditorHomeActions() {
  const { openDialog } = useProjectActions();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        variant="brand"
        className="h-12 px-8 text-base font-semibold shadow-lg shadow-brand/10 transition-all hover:shadow-brand/20"
        onClick={() => openDialog("create")}
      >
        <Plus className="mr-2 h-5 w-5" />
        New Project
      </Button>

      <p className="text-sm text-copy-faint">Workspace session is active and secure</p>
    </div>
  );
}