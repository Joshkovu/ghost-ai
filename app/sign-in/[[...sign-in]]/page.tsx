import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";
import { clerkSignInPath, clerkSignUpPath } from "@/lib/clerk-routes";
import { clerkAuthAppearance } from "../../../lib/clerk-auth-appearance";

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to Ghost AI"
      description="Return to your editor workspace, continue collaborating, and manage your projects in one place."
      bullets={[
        "Open your active editor workspace",
        "Manage projects and collaborators",
        "Keep your architecture work in sync",
      ]}
    >
      <SignIn
        routing="path"
        path={clerkSignInPath}
        signUpUrl={clerkSignUpPath}
        fallbackRedirectUrl="/editor"
        forceRedirectUrl="/editor"
        appearance={clerkAuthAppearance}
      />
    </AuthShell>
  );
}