import type { Metadata } from "next";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/pages/Courses.jsx — a full-height iframe embed of
// the external courses storefront. No original <SEO> component, but the
// legacy Express sitemap (Server/src/routes/sitemap.js) explicitly lists
// this route as indexable ("weekly", priority 0.8), so real metadata is set
// here rather than noindex.
export const metadata: Metadata = {
  title: "Courses - ACME Academy",
  description: "Explore ACME Academy's NIMCET, CUET-PG and MAH-CET MCA entrance preparation courses.",
  alternates: {
    canonical: "/acme-courses",
  },
  openGraph: {
    type: "website",
    title: "Courses - ACME Academy",
    description: "Explore ACME Academy's NIMCET, CUET-PG and MAH-CET MCA entrance preparation courses.",
    url: "/acme-courses",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses - ACME Academy",
    description: "Explore ACME Academy's NIMCET, CUET-PG and MAH-CET MCA entrance preparation courses.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

export default function CoursesPage() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe src="https://acmea.courses.store/" title="ACME Academy Courses" className="w-full h-full" style={{ border: "none" }}></iframe>
    </div>
  );
}
