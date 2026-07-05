import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import RankProtectedRoute from "@/components/rank-predictor/protected-route";
import ReportContent from "@/components/rank-predictor/report-content";

// Ported from client/src/features/rank-predictor/pages/ReportPage.jsx.
export const metadata: Metadata = {
  title: "NIMCET Rank Predictor - Report - ACME Academy",
  robots: { index: false, follow: false },
};

export default function RankPredictorReportPage() {
  return (
    <RankProtectedRoute>
      <RankPredictorLayout>
        <ReportContent />
      </RankPredictorLayout>
    </RankProtectedRoute>
  );
}
