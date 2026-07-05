import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { fetchPracticeSetsForSeo, buildPracticeSetsJsonLd, practiceSetsMetadataBase } from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

export const metadata: Metadata = {
  ...practiceSetsMetadataBase,
  alternates: { canonical: "/acme-practice-sets" },
  openGraph: { type: "website", ...practiceSetsMetadataBase, url: "/acme-practice-sets", siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
  twitter: { card: "summary_large_image", ...practiceSetsMetadataBase, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
};

export default async function PracticeSetsIndexPage() {
  const practiceSets = await fetchPracticeSetsForSeo();
  const jsonLd = buildPracticeSetsJsonLd(practiceSets, "/acme-practice-sets");

  return (
    <>
      <Script id="ld-practice-sets" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <PracticeSetsClient />
      </Suspense>
    </>
  );
}
