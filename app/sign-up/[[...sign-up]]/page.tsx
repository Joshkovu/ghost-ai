import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";
import { clerkSignInPath, clerkSignUpPath } from "@/lib/clerk-routes";
import { clerkAuthAppearance } from "../../../lib/clerk-auth-appearance";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your Ghost AI account"
      description="Start a workspace for system design, invite collaborators, and keep every project organized from day one."
      bullets={[
        "Set up a new collaborative workspace",
        "Track system design work in one place",
        "Move from prompt to spec with less friction",
      ]}
    >
      <SignUp
        routing="path"
        path={clerkSignUpPath}
        signInUrl={clerkSignInPath}
        fallbackRedirectUrl="/editor"
        forceRedirectUrl="/editor"
        appearance={clerkAuthAppearance}
      />
    </AuthShell>
  );
}