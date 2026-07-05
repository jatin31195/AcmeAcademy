import type { Metadata } from "next";
import { TestResultContent } from "@/components/test/test-result-content";

// Ported from client/src/pages/TestResult.jsx (private, ProtectedRoute-gated
// page with no original <SEO> component). Static noindex title only — see
// the same rationale in app/(marketing)/acme-test/[testId]/page.tsx.
export const metadata: Metadata = {
  title: "Test Result - ACME Academy",
  robots: { index: false, follow: false },
};

export default async function TestResultPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  return <TestResultContent testId={testId} />;
}
