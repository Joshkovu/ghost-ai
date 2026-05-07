import { auth, currentUser } from "@clerk/nextjs/server";

export interface ClerkIdentity {
  userId: string;
  primaryEmail: string | null;
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  return {
    userId,
    primaryEmail: user?.emailAddresses[0]?.emailAddress ?? null,
  };
}

export function hasProjectAccess(
  project: { ownerId: string; collaborators: Array<{ email: string }> },
  identity: ClerkIdentity | null,
) {
  if (!identity) {
    return false;
  }

  if (project.ownerId === identity.userId) {
    return true;
  }

  if (!identity.primaryEmail) {
    return false;
  }

  return project.collaborators.some((collaborator) => collaborator.email === identity.primaryEmail);
}