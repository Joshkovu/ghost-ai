import { prisma } from "@/lib/prisma";
import type { ProjectListItem } from "@/lib/project-types";

export interface EditorProjectGroups {
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
}

export async function getEditorProjectGroups(userId: string, email?: string | null): Promise<EditorProjectGroups> {
  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
      },
    }),
    email
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: {
              some: {
                email,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
          },
        })
      : Promise.resolve([] as Array<{ id: string; name: string }>),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) => ({
      ...project,
      isOwner: true,
    })),
    sharedProjects: sharedProjects.map((project) => ({
      ...project,
      isOwner: false,
    })),
  };
}