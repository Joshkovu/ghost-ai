import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { clerkSignInPath, clerkSignUpPath } from "@/lib/clerk-routes";

const publicRoutes = createRouteMatcher([
  "/",
  `${clerkSignInPath}(.*)`,
  `${clerkSignUpPath}(.*)`,
]);

export default clerkMiddleware(async (auth, request) => {
  if (!publicRoutes(request)) {
    await auth.protect();
  }
});