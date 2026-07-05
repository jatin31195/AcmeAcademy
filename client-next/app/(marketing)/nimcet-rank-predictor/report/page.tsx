import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import RankProtectedRoute from "@/components/rank-predictor/protected-route";
import ReportContent from "@/components/rank-predictor/report-content";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/features/rank-predictor/pages/ReportPage.jsx.
const title = "NIMCET Rank Predictor Report - Predicted Rank & Colleges | ACME Academy";
const description = "View your personalized NIMCET Rank Predictor report — predicted All India Rank, cutoff comparison, and matching MCA college options from ACME Academy.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { type: "website", title, description, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
  twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
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
