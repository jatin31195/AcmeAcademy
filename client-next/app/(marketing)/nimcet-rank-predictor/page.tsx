import type { Metadata } from "next";
import RankPredictorLayout from "@/components/rank-predictor/layout";
import OtpAuthContent from "@/components/rank-predictor/otp-auth-dynamic";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/features/rank-predictor/pages/OtpAuthPage.jsx
// (entry route of the merged standalone Rank Predictor project). No
// original <SEO> component — static noindex title added as the same
// gap-fix pattern used for other private/session-gated pages. Still
// noindex: this is the OTP-gated entry step, not a content page.
const title = "NIMCET Rank Predictor - Verify Mobile Number | ACME Academy";
const description = "Predict your NIMCET All India Rank and expected MCA colleges with ACME Academy's Rank Predictor. Verify your mobile number via OTP to begin.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: { type: "website", title, description, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
  twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
};

export default function RankPredictorEntryPage() {
  return (
    <RankPredictorLayout>
      <OtpAuthContent />
    </RankPredictorLayout>
  );
}
