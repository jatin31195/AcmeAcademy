import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import OtpAuthContent from "@/components/rank-predictor/otp-auth-dynamic";

// Ported from client/src/features/rank-predictor/pages/OtpAuthPage.jsx
// (entry route of the merged standalone Rank Predictor project). No
// original <SEO> component — static noindex title added as the same
// gap-fix pattern used for other private/session-gated pages.
export const metadata: Metadata = {
  title: "NIMCET Rank Predictor - ACME Academy",
  robots: { index: false, follow: false },
};

export default function RankPredictorEntryPage() {
  return (
    <RankPredictorLayout>
      <OtpAuthContent />
    </RankPredictorLayout>
  );
}
