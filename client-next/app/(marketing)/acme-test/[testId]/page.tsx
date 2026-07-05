import type { Metadata } from "next";
import { TestContent } from "@/components/test/test-content";

// Ported from client/src/pages/Test.jsx. The original rendered a dynamic
// <SEO>/JSON-LD Quiz schema once testData loaded client-side, but this is a
// ProtectedRoute-gated private page (middleware already redirects
// unauthenticated visitors before it renders) and SEO/metadata work is
// explicitly out of scope for this phase — so only a static noindex title is
// set here, matching the gap-fix pattern used for Dashboard/Login/Signup.
export const metadata: Metadata = {
  title: "Attempt Test - ACME Academy",
  robots: { index: false, follow: false },
};

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return <TestContent testId={testId} />;
}
