"use client";

import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useProjectActions } from "@/lib/context/project-actions-context";

export default function EditorPage() {
  const { openDialog } = useProjectActions();

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-copy-primary">
            Create a project or open an existing one
          </h1>
          <p className="text-lg text-copy-secondary max-w-lg mx-auto leading-relaxed">
            Start a new architecture workspace or choose a project from the sidebar.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <Button 
            variant="brand" 
            className="h-12 px-8 text-base font-semibold shadow-lg shadow-brand/10 hover:shadow-brand/20 transition-all"
            onClick={() => openDialog("create")}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
          
          <p className="text-sm text-copy-faint">
            Workspace session is active and secure
          </p>
        </div>
      </div>
    </section>
  );
}