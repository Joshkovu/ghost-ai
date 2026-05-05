export default function EditorPage() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl border border-surface-border bg-elevated/80 px-6 py-10 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:px-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-copy-faint">
            Editor canvas
          </p>
          <h1 className="text-2xl font-semibold md:text-3xl">Workspace shell ready</h1>
          <p className="max-w-2xl text-sm leading-6 text-copy-secondary">
            This chapter establishes the shared navbar and floating project sidebar
            that future editor work will reuse.
          </p>
        </div>
      </div>
    </section>
  );
}