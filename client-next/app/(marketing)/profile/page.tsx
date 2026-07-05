import type { Metadata } from "next";
import { ProfileContent } from "@/components/profile/profile-content";

// Ported from client/src/pages/profile.jsx (private, ProtectedRoute-gated
// page with no original <SEO> component). Static noindex title only — see
// the same rationale in the Dashboard/Test page wrappers.
export const metadata: Metadata = {
  title: "Profile Verification - ACME Academy",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileContent />;
}
