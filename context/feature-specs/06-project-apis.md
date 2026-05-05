The database schema is ready. Build the backend project API routes only.

## Routes

Create REST endpoints for:

- `GET /api/projects` : list current user's projects and shared projects
- `GET /api/projects/:id` : get a specific project by id
- `POST /api/projects` : create a new project
- `PUT /api/projects/:id` : rename a project
- `DELETE /api/projects/:id` : delete a project 

## Rules

Use the authenticated Clerk user ID as `ownerId`

When creating:
- default missing project name to `Untitled Project`
- use the schema's existing ID strategy, do not add sequential IDs

## Security:

- unauthenticated requests return `401`
- only the project owner can rename or delete
- non-owner mutations return `403`
- all routes must be authenticated

Keep this backend-only. Do not wire the UI yet.

## Check when done

- [x] routes exist for list/create/rename/delete project
- [x] owner checks are enforced for rename/delete
- [x] `401` and `403` responses are handled correctly
- [x] `pnpm run build` passes