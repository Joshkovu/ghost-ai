# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

-  Complete

## Current Goal

- Add shape-specific visual rendering and canvas controls.

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
- Implemented shape panel and node creation (as specified in 12-shape-panel.md)
  - Added floating bottom-center shape toolbar with 6 draggable shape types
  - Implemented drag/drop handlers with screen-to-canvas coordinate conversion
  - Created custom CanvasNode renderer with handles for connections
  - Generated deterministic node IDs using shape name, timestamp, and counter
  - Integrated shape panel with canvas drop zone
- Fixed canvas visual issues and layout (as specified in current-issues.md)
  - Removed floating card styling (rounded borders, box shadows) from canvas
  - Converted canvas to full-bleed, infinite design canvas aesthetic
  - Repositioned sidebars from grid layout to fixed overlays with proper z-index
  - Implemented smooth sidebar slide animations using transform: translateX
  - Fixed left sidebar to fully hide off-screen when toggled
  - Fixed right sidebar to slide in/out from the right edge
  - Canvas background now extends edge-to-edge under both sidebars
  - Removed padding/margins from canvas wrapper for seamless edge-to-edge experience
- Fixed drag and drop and removed MiniMap white box
  - Removed MiniMap component (white box on lower right corner)
  - Refactored drop handler to be a child of ReactFlow for proper context
  - Fixed drag/drop coordinate calculation using React Flow's pane element positioning
  - Drop handler now properly intercepts shape drag events from ShapePanel
  - Nodes are correctly positioned on canvas when dropped
- Implemented shape-specific node rendering and drag preview (as specified in 13-node-shape.md)
  - Added reusable shape visual renderer for rectangle, pill, circle, diamond, hexagon, and cylinder
  - Rendered rectangle, pill, and circle with CSS-based node styling
  - Rendered diamond, hexagon, and cylinder with SVG-based node shapes that scale with node size
  - Kept node borders subtle at rest and brighter when selected
  - Added shape-specific drag ghost previews that match the dragged shape and size
  - Enabled inline text editing for selected node labels through Liveblocks-backed node updates

## In Progress

- None.

## Next Up

- Implement canvas controls panel (delete, duplicate, select tools).
- Add label editing for nodes.

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
- `pnpm run build` passes after implementing the shape panel with drag/drop node creation and custom node rendering.
- `pnpm run build` passes after fixing all canvas visual issues and repositioning sidebars as fixed overlays with smooth animations.
- `pnpm run build` passes after fixing drag/drop functionality and removing the MiniMap white box overlay.
- `pnpm run build` passes after adding shape-specific rendering, drag previews, and editable node labels.
