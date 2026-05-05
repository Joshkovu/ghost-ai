import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/auth-shell";
import { clerkSignInPath, clerkSignUpPath } from "@/lib/clerk-routes";
import { clerkAuthAppearance } from "../../../lib/clerk-auth-appearance";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Design systems at the speed of thought."
      description="Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time."
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