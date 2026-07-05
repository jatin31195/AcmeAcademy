import type { Metadata } from "next";
import { SignupContent } from "@/components/auth/signup-content";

// Ported from client/src/pages/Signup.jsx, which had NO <SEO> component at
// all (a gap flagged in the Phase 1 audit, unlike Login.jsx which correctly
// set noindex). Adding noindex metadata here is the same approved gap-fix
// category as the Phase 1 legal pages — closing a pre-existing omission,
// not new scope.
export const metadata: Metadata = {
  title: "Sign Up - ACME Academy",
  description: "Create your ACME Academy account to take mock tests, track results, and begin your MCA entrance preparation journey.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupContent />;
}
