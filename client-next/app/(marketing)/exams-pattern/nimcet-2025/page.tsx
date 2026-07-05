import type { Metadata } from "next";
import Nimcet2025 from "@/components/exam-pattern/nimcet2025";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/App.jsx's standalone route
// "/exams-pattern/nimcet-2025" -> <Nimcet2025 />. The original had no
// page-specific SEO/Helmet for this route either, but in a client-rendered
// SPA that just meant react-helmet-async left whatever the previously
// visited page had set — indeterminate, but never a hard, always-present
// wrong tag. Left without its own metadata export, this page would
// otherwise inherit the root layout's literal canonical of "/", which is a
// concrete, deterministic bug unique to static server-rendered metadata
// (self-canonicalizing this page to the homepage). Phase 4 SEO audit
// flagged this; fixed here with page-specific metadata, matching the
// sibling /exam-pattern route's tone.
export const metadata: Metadata = {
  title: "NIMCET 2025 Exam Pattern | Syllabus, Marking Scheme & Structure",
  description:
    "Detailed NIMCET 2025 exam pattern — syllabus, marking scheme, question structure, and duration for the NIT MCA Common Entrance Test. Prepare with ACME Academy.",
  keywords: "NIMCET 2025 exam pattern, NIMCET syllabus, NIMCET marking scheme, NIT MCA entrance exam",
  alternates: {
    canonical: "/exams-pattern/nimcet-2025",
  },
  openGraph: {
    type: "website",
    title: "NIMCET 2025 Exam Pattern | Syllabus, Marking Scheme & Structure",
    description:
      "Detailed NIMCET 2025 exam pattern — syllabus, marking scheme, question structure, and duration for the NIT MCA Common Entrance Test.",
    url: "/exams-pattern/nimcet-2025",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "NIMCET 2025 Exam Pattern | ACME Academy",
    description: "Syllabus, marking scheme, and question structure for NIMCET 2025.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

export default function NimcetPatternStandalonePage() {
  return <Nimcet2025 />;
}
