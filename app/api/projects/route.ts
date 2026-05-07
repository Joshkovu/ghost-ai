import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { createRoomId } from "@/lib/project-room";
import { getEditorProjectGroups } from "@/lib/projects";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const groups = await getEditorProjectGroups(userId, user.emailAddresses[0]?.emailAddress);

    return NextResponse.json(groups);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "Untitled Project";
    const roomId = typeof body.roomId === "string" && body.roomId.trim() ? body.roomId.trim() : createRoomId(name);

    const project = await prisma.project.create({
      data: {
        ownerId: userId,
        name,
        status: "DRAFT",
        activities: {
          create: {
            event: "PROJECT_CREATED",
          },
        },
      },
    });

    return NextResponse.json({
      ...project,
      roomId,
    }, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}