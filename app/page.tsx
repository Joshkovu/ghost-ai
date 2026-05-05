import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { clerkSignInPath } from "@/lib/clerk-routes";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/editor");
  }

  redirect(clerkSignInPath);
}
