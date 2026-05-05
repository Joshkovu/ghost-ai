Prisma is already installed . Add the project data models, Prisma client singleton and first migration.

## Models

Create `prisma/models/project.prisma` .

Add `Project`:

- owner ID mapped to Clerk user
- name 
- optional description
- status enum: `DRAFT`, `ARCHIVED`
-`canvasJsonPath` for future canvas blob storage
- timestamps
- indexes on owner ID and creation date 

Add `ProjectCollaborator`:
- project relation with cascade delete
- collaborator email
- creation timestamp
- unique constraint on project and email
- indexes on email and project/date

Add `ProjectActivity`:
- project relation
- timestamp
- "event" enum: `PROJECT_CREATED`, `PROJECT_RENAMED`, `PROJECT_DELETED`, `DOCUMENT_CREATED`, `DOCUMENT_RENAMED`, `DOCUMENT_DELETED`, `COLLABORATOR_ADDED`, `COLLABORATOR_REMOVED`

Do not add extra fields unless required by Prisma.

## Prisma Client 

Create `lib/prisma.ts` as a cached singleton:
 
 Branch by `DATABASE_URL`

 - if it starts with `prisma+postgres://` use Accelerate
 - otherwise use direct `@prisma/adapter-pg`

 Cache the client on `global` in development for hot reloads.

## Migration

Run `npx prisma migrate dev --name init_projects` after creating the model files.

## Dependencies 

Already installed:
- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## Check When Done:
- No TypeScript errors in `prisma.ts` or generated client
- `npx prisma generate` runs without errors
- `npx prisma db push` creates tables (or `dev` runs without errors)
- migration runs successfully
- Prisma client exports correctly from `lib/prisma.ts`