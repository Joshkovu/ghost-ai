# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Next.js 16 + TypeScript | Full-stack app with server/client boundaries |
| UI        |  Tailwind + shadcn/ui | Component composition and styling |
| Auth      |  Clerk               | User identity and route protection |
| Database  |  Prisma + PostgreSQL  | Relational metadata:projects,collaborators,specs,task runs |
| Canvas  | Liveblocks + React        | Real-time collaborative canvas, presence and cursors |
| Background tasks   | Trigger.dev      | Durable AI generation workflows |
| Artifact storage  | Vercel Blob       | Canvas snapshots and generated markdown specs|


## System Boundaries

- `app/api` — Authenticated request handlers:input validation, ownership checks, task triggering and persistence.
- `trigger` — Long- running background jobs: AI design generation and spec generation.
- `lib` — Shared infrastructure: Prisma client, access control helpers and utilities.
- `components` — UI composition: canvas surfaces, sidebars, dialogs and interactive elements.
- `prisma` — Database schema and generated client output.
- `data` — Legacy local directory . Not used for new artifacts.


## Storage Model

- **[Storage type e.g. Database]**: [What lives here —
  e.g. metadata, ownership, relationships]
- **[Storage type e.g. Blob/File Storage]**: [What lives
  here — e.g. generated files, media, large artifacts]

## Auth and Access Model

- [How authentication works — e.g. Every user signs in
  via Clerk]
- [How ownership works — e.g. Every project has a single
  owner]
- [How access control works — e.g. Only the owner or a
  collaborator can mutate project resources]

## Invariants

1. [Rule the codebase must never violate — e.g. Request
   handlers do not run long-lived background work]
2. [Invariant two]
3. [Invariant three]
4. [Invariant four]
