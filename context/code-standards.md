# Code Standards

## General

-  Keep modules small and single-purpose
-  Fix root causes, do not layer workarounds
-  Do not mix unrelated concerns in one
component or route
- Respect the system boundaries defined in the `architecture.md` .


## TypeScript

- Strict mode is required throughout the project
-  Avoid any — use explicit interfaces or narrowly
scoped types
- Validate unknown external input at system
  boundaries before trusting it
- Use interface for object contracts.

## Next.js

- Default to React server components
- Add use client only when the component needs  browser
interactivity, hooks or real-time state.
-  Keep route handlers focused on a
single responsibility
- Long-running work belongs in the background tasks, not in request handlers.

## Styling

- Use CSS custom property tokens defined in globals.css — no
raw Tailwind color classes like zinc-* or hardcoded hex values.
- Follow the border radius scale defined
in `ui-context.md`
- Reference tokens through their tailwind utility names: bg-base, text-copy-primary, border-surface-border, text-brand etc
- Maintain the border radius scale: rounded-xl for small elements, rounded-2xl for cards , rounded-3xl for modals.

## API Routes

- Validate and parse request input before
  any logic runs
- Enforce auth and ownership before any mutation
- Return consistent, predictable response shapes

## Data and Storage

- Project Metadata and relationships belong in PostgreSQL via Prisma.
- Canvas snapshots and generated specs belong in Vercel Blob; Prisma stores only the blob URL reference.
- Do not store large generated content directly in
the database
- Task run records are first-class relational data - treat ownership and run IDs as verified before any token issurance.

## File Organization

- `lib/` — shared infrastructure:Prisma client , auth helpers, utilities.
- `trigger/` — all durable background tasks and AI workflows.
- `components/` — UI composition only; no business logic.
- `app/api/` — route handlers for auth , triggering and persistence.
- Name files after the responsibility they contain , not the technology.
