import type { Metadata } from "next";
import { TestResultContent } from "@/components/test/test-result-content";

// Ported from client/src/pages/TestResult.jsx's optional :attemptNumber?
// route param — App Router has no single-segment-optional syntax, so the
// original's one react-router route becomes these two sibling page.tsx
// files (with vs. without the attemptNumber segment), both rendering the
// same Client component.
export const metadata: Metadata = {
  title: "Test Result - ACME Academy",
  robots: { index: false, follow: false },
};

export default async function TestResultAttemptPage({
  params,
}: {
  params: Promise<{ testId: string; attemptNumber: string }>;
}) {
  const { testId, attemptNumber } = await params;
  return <TestResultContent testId={testId} attemptNumber={attemptNumber} />;
}
