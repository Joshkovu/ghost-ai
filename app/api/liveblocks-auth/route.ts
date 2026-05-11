import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getLiveblocksClient, getLiveblocksCursorColor } from "@/lib/liveblocks";
import { getCurrentClerkIdentity, hasProjectAccess } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";

interface LiveblocksAuthBody {
  room?: string;
  roomId?: string;
  projectId?: string;
}

function toDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
}, fallbackEmail: string) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

  if (fullName) {
    return fullName;
  }

  if (user.username) {
    return user.username;
  }

  return user.primaryEmailAddress?.emailAddress ?? fallbackEmail;
}

function getRequestedRoomId(request: NextRequest, body: LiveblocksAuthBody) {
  const roomId =
    body.projectId ??
    body.roomId ??
    body.room ??
    request.nextUrl.searchParams.get("room") ??
    request.nextUrl.searchParams.get("roomId") ??
    request.nextUrl.searchParams.get("projectId");

  return typeof roomId === "string" ? roomId.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const identity = await getCurrentClerkIdentity();

    if (!identity) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as LiveblocksAuthBody;
    const roomId = getRequestedRoomId(request, body);

    if (!roomId) {
      return new NextResponse("Room ID is required", { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: roomId },
      include: {
        collaborators: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!project) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (!hasProjectAccess(project, identity)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const liveblocks = getLiveblocksClient();

    await liveblocks.getOrCreateRoom(project.id, {
      defaultAccesses: [],
      metadata: {
        title: project.name,
      },
    });

    const fallbackEmail =
      identity.primaryEmail ??
      user.emailAddresses[0]?.emailAddress ??
      user.primaryEmailAddress?.emailAddress ??
      "";
    const displayName = toDisplayName(user, fallbackEmail);

    const session = liveblocks.prepareSession(identity.userId, {
      userInfo: {
        name: displayName,
        avatar: user.imageUrl ?? "",
        color: getLiveblocksCursorColor(identity.userId),
      },
    });

    session.allow(project.id, session.FULL_ACCESS);

    const { status, body: sessionBody } = await session.authorize();

    return new NextResponse(sessionBody, { status });
  } catch (error) {
    console.error("[LIVEBLOCKS_AUTH_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}