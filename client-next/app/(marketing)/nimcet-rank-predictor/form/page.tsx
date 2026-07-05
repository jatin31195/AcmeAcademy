import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import RankProtectedRoute from "@/components/rank-predictor/protected-route";
import FormContent from "@/components/rank-predictor/form-dynamic";

// Ported from client/src/features/rank-predictor/pages/FormPage.jsx.
export const metadata: Metadata = {
  title: "NIMCET Rank Predictor - Form - ACME Academy",
  robots: { index: false, follow: false },
};

export default function RankPredictorFormPage() {
  return (
    <RankProtectedRoute>
      <RankPredictorLayout>
        <FormContent />
      </RankPredictorLayout>
    </RankProtectedRoute>
  );
}
