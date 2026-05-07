import { EditorHomeActions } from "@/components/editor/editor-home-actions";

type EditorPageProps = {
  searchParams?: {
    projectId?: string;
    roomId?: string;
  };
};

export default function EditorPage({ searchParams }: EditorPageProps) {
  const activeProjectId = searchParams?.projectId ?? null;
  const roomId = searchParams?.roomId ?? null;

  if (activeProjectId) {
    return (
      <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-copy-faint">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-copy-primary md:text-4xl">
              Workspace ready
            </h1>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-copy-secondary">
              The new project is open. Use the sidebar to rename it, delete it, or switch to another workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface/70 px-5 py-4 text-left shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copy-faint">Current workspace</p>
            <p className="mt-2 break-all text-sm text-copy-primary">Project ID: {activeProjectId}</p>
            {roomId ? <p className="mt-1 break-all text-sm text-copy-secondary">Room ID: {roomId}</p> : null}
          </div>

          <p className="text-sm text-copy-faint">
            The canvas wiring is ready for the next step.
          </p>
        </div>
      </section>
    );
  }

  return (
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
  );
}
