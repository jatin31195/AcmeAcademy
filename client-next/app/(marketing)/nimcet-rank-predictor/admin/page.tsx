import type { Metadata } from "next";
import RankProtectedRoute from "@/components/rank-predictor/protected-route";
import AdminContent from "@/components/rank-predictor/admin-content";

// Ported from client/src/features/rank-predictor/pages/AdminPage.jsx.
// Not wrapped in RankPredictorLayout, matching the original route
// (`<RankProtectedRoute><RPAdminPage /></RankProtectedRoute>`, no layout).
export const metadata: Metadata = {
  title: "NIMCET Rank Predictor - Admin - ACME Academy",
  robots: { index: false, follow: false },
};

export default function RankPredictorAdminPage() {
  return (
    <RankProtectedRoute>
      <AdminContent />
    </RankProtectedRoute>
  );
}
