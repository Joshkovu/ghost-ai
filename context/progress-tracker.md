# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

-  Complete

## Current Goal

- Build canvas interactions: custom node rendering, edge handlers, and node creation flows.

## Completed

- Configured the global dark color system in `app/globals.css`.
- Added `EditorNavbar` and `ProjectSidebar` in `components/editor/`.
- Upgraded `components/ui/tabs.tsx` to support shadcn-style tabs.
- Added tokenized dialog slots in `components/ui/dialog.tsx`.
- Wired the editor shell into `app/page.tsx`.
- Added Clerk auth provider, protected editor routing, and public sign-in/sign-up pages.
- Added `proxy.ts` route protection and `/` auth-based redirects.
- Implemented project dialogs (Create, Rename, Delete) and sidebar actions with mock data.
- Prisma Setup & Project Models (as specified in 05-prisma.md)
- Project API Routes (as specified in 06-project-apis.md)
- Wired the editor home sidebar, dialogs, and create flow to the real project APIs.
- Built `/editor/[roomId]` with server-side access checks, access denial state, and workspace shell placeholders.
- Implemented workspace Share dialog with collaborator list, owner invite/remove controls, and copy-link feedback.
- Added `/api/projects/[id]/collaborators` API with owner-enforced invite/remove and Clerk-based collaborator enrichment.
- Configured Liveblocks presence/user metadata, a cached node client, deterministic cursor colors, and the project-scoped auth route.
- Implemented base canvas with Liveblocks-backed React Flow (as specified in 11-base-canvas.md)
  - Created `types/canvas.ts` with shared canvas node and edge types
  - Built client-side `CanvasWrapper` component with Liveblocks room setup
  - Wired React Flow with `useLiveblocksFlow` for collaborative state sync
  - Integrated MiniMap, dot-pattern background, and fit-to-view functionality
  - Updated `EditorWorkspaceShell` to render the collaborative canvas

## In Progress

- None.

## Next Up

- Add custom node and edge rendering for the canvas.
- Implement node creation and edge connection flows.
- Add canvas control panel (zoom, fit-to-view, select, delete).

## Open Questions

- None.

## Architecture Decisions

- Liveblocks rooms are keyed by project IDs and created on demand in `/api/liveblocks-auth` after Clerk auth and project access checks.

## Session Notes

- `npm run build` passes after the auth wiring, route split, and Clerk theme fixes.
- `pnpm run build` passes after wiring the editor home to server-fetched project data and real create/rename/delete mutations.
- `pnpm run build` passes after adding `/editor/[roomId]`, access helpers, and workspace shell placeholders.
- `pnpm run build` passes after refining the workspace alignment and replacing the AI sidebar icon with a bright `AI chat` button.
- `pnpm run build` passes after adding share dialog flows and collaborator APIs with resilient Clerk enrichment fallback.
- `pnpm run build` passes after adding the Liveblocks auth route, cached node client, and typed presence/user metadata.
- `pnpm run build` passes after implementing the base canvas with Liveblocks-backed React Flow, MiniMap, and background patterns.
