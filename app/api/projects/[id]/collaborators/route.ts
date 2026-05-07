import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

interface CollaboratorView {
  email: string;
  name: string;
  avatarUrl: string | null;
}

function toDisplayName(user: { firstName: string | null; lastName: string | null; username: string | null; primaryEmailAddress?: { emailAddress: string } | null }, fallbackEmail: string) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  return user.primaryEmailAddress?.emailAddress ?? fallbackEmail;
}

async function enrichCollaborators(emails: string[]): Promise<CollaboratorView[]> {
  if (emails.length === 0) {
    return [];
  }

  try {
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: emails,
      limit: emails.length,
    });

    const byEmail = new Map<string, { name: string; avatarUrl: string | null }>();

    for (const user of users.data) {
      for (const address of user.emailAddresses) {
        byEmail.set(address.emailAddress.toLowerCase(), {
          name: toDisplayName(user, address.emailAddress),
          avatarUrl: user.imageUrl ?? null,
        });
      }
    }

    return emails.map((email) => {
      const profile = byEmail.get(email.toLowerCase());

      return {
        email,
        name: profile?.name ?? email,
        avatarUrl: profile?.avatarUrl ?? null,
      };
    });
  } catch (error) {
    console.error("[PROJECT_COLLABORATORS_ENRICH]", error);

    // Graceful fallback: if Clerk lookup fails, still return collaborator emails.
    return emails.map((email) => ({
      email,
      name: email,
      avatarUrl: null,
    }));
  }
}

async function getProjectForAccess(projectId: string) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return { status: 401 as const };
  }

  let email = typeof sessionClaims?.email === "string" ? sessionClaims.email : null;

  if (!email) {
    const user = await currentUser();
    email = user?.emailAddresses[0]?.emailAddress ?? null;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!project) {
    return { status: 404 as const };
  }

  const isOwner = project.ownerId === userId;
  const isCollaborator = Boolean(email && project.collaborators.some((collaborator) => collaborator.email === email));

  if (!isOwner && !isCollaborator) {
    return { status: 403 as const };
  }

  return {
    status: 200 as const,
    project,
    isOwner,
    email,
    userId,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const access = await getProjectForAccess(id);

    if (access.status !== 200) {
      return new NextResponse(
        access.status === 401 ? "Unauthorized" : access.status === 404 ? "Not Found" : "Forbidden",
        { status: access.status },
      );
    }

    const emails = access.project.collaborators.map((collaborator) => collaborator.email);
    const collaborators = await enrichCollaborators(emails);

    return NextResponse.json({
      collaborators,
      canManage: access.isOwner,
    });
  } catch (error) {
    console.error("[PROJECT_COLLABORATORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const access = await getProjectForAccess(id);

    if (access.status !== 200) {
      return new NextResponse(
        access.status === 401 ? "Unauthorized" : access.status === 404 ? "Not Found" : "Forbidden",
        { status: access.status },
      );
    }

    if (!access.isOwner) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const email = rawEmail.toLowerCase();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    const ownerEmail = access.email?.toLowerCase();
    if (ownerEmail && email === ownerEmail) {
      return new NextResponse("Owner already has access", { status: 400 });
    }

    await prisma.projectCollaborator.upsert({
      where: {
        projectId_email: {
          projectId: id,
          email,
        },
      },
      create: {
        projectId: id,
        email,
      },
      update: {},
    });

    await prisma.projectActivity.create({
      data: {
        projectId: id,
        event: "COLLABORATOR_ADDED",
      },
    });

    const [collaborator] = await enrichCollaborators([email]);

    return NextResponse.json({ collaborator }, { status: 201 });
  } catch (error) {
    console.error("[PROJECT_COLLABORATORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const access = await getProjectForAccess(id);

    if (access.status !== 200) {
      return new NextResponse(
        access.status === 401 ? "Unauthorized" : access.status === 404 ? "Not Found" : "Forbidden",
        { status: access.status },
      );
    }

    if (!access.isOwner) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const email = rawEmail.toLowerCase();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    await prisma.projectCollaborator.delete({
      where: {
        projectId_email: {
          projectId: id,
          email,
        },
      },
    });

    await prisma.projectActivity.create({
      data: {
        projectId: id,
        event: "COLLABORATOR_REMOVED",
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return new NextResponse("Not Found", { status: 404 });
    }

    console.error("[PROJECT_COLLABORATORS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}