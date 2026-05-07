import { auth, currentUser } from "@clerk/nextjs/server";

import { EditorShell } from "@/components/editor/editor-shell";
import { EditorHomeActions } from "@/components/editor/editor-home-actions";
import { getEditorProjectGroups } from "@/lib/projects";

export default async function EditorPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const groups = userId && user
    ? await getEditorProjectGroups(userId, user.emailAddresses[0]?.emailAddress)
    : {
        ownedProjects: [],
        sharedProjects: [],
      };

  return (
    <EditorShell ownedProjects={groups.ownedProjects} sharedProjects={groups.sharedProjects}>
      <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-copy-primary md:text-4xl">
              Create a project or open an existing one
            </h1>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-copy-secondary">
              Start a new architecture workspace or choose a project from the sidebar.
            </p>
          </div>

          <EditorHomeActions />
        </div>
      </section>
    </EditorShell>
  );
}
