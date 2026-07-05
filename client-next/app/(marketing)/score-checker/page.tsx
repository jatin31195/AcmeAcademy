import type { Metadata } from "next";
import { ScoreCheckerContent } from "@/components/score-checker/score-checker-content";

// Ported from client/src/pages/ScoreCheckerPage.jsx.
export const metadata: Metadata = {
  title: "Score Checker — CUET PG & NIMCET | ACME Academy",
  description:
    "Instantly check your CUET PG or NIMCET score. Upload NTA response sheet & answer key PDFs and get a downloadable score card from ACME Academy.",
  keywords: "CUET PG score checker, NIMCET marks calculator, NTA response sheet checker, ACME Academy score card download",
  alternates: {
    canonical: "/score-checker",
  },
  openGraph: {
    type: "website",
    title: "Score Checker — CUET PG & NIMCET | ACME Academy",
    description:
      "Instantly check your CUET PG or NIMCET score. Upload NTA response sheet & answer key PDFs and get a downloadable score card from ACME Academy.",
    url: "/score-checker",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Score Checker — CUET PG & NIMCET | ACME Academy",
    description: "Instantly check your CUET PG or NIMCET score and get a downloadable score card.",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

export default function ScoreCheckerPage() {
  return <ScoreCheckerContent />;
}
