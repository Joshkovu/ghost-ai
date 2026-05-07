import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell";
import { getCurrentClerkIdentity, hasProjectAccess } from "@/lib/project-access";
import { getEditorProjectGroups } from "@/lib/projects";
import { prisma } from "@/lib/prisma";

interface WorkspacePageProps {
  params: Promise<{ roomId: string }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;

  if (!roomId) {
    return <AccessDenied />;
  }

  const project = await prisma.project.findUnique({
    where: { id: roomId },
    include: {
      collaborators: true,
    },
  });

  if (!project || !hasProjectAccess(project, identity)) {
    return <AccessDenied />;
  }

  const groups = await getEditorProjectGroups(identity.userId, identity.primaryEmail);

  return (
    <EditorWorkspaceShell
      projectId={project.id}
      projectName={project.name}
      ownedProjects={groups.ownedProjects}
      sharedProjects={groups.sharedProjects}
    />
  );
}