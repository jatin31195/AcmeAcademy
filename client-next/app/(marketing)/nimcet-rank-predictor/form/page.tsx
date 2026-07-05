import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import RankProtectedRoute from "@/components/rank-predictor/protected-route";
import FormContent from "@/components/rank-predictor/form-dynamic";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/features/rank-predictor/pages/FormPage.jsx.
const title = "NIMCET Rank Predictor - Enter Your Details | ACME Academy";
const description = "Enter your NIMCET response sheet details to predict your All India Rank, likely cutoff, and matching MCA colleges with ACME Academy.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { type: "website", title, description, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
  twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
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
