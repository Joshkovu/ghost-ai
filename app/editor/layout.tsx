import { auth, currentUser } from "@clerk/nextjs/server";
import type { ReactNode } from "react";

import { EditorShell } from "@/components/editor/editor-shell";
import { getEditorProjectGroups } from "@/lib/projects";

export default async function EditorLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  const user = await currentUser();

  const groups = userId && user ? await getEditorProjectGroups(userId, user.emailAddresses[0]?.emailAddress) : {
    ownedProjects: [],
    sharedProjects: [],
  };

  return (
    <EditorShell ownedProjects={groups.ownedProjects} sharedProjects={groups.sharedProjects}>
      {children}
    </EditorShell>
  );
}