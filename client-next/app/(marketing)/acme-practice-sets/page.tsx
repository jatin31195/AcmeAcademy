import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { fetchPracticeSetsForSeo, buildPracticeSetsJsonLd, buildPracticeSetsIndexMetadata } from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";

export async function generateMetadata(): Promise<Metadata> {
  const practiceSets = await fetchPracticeSetsForSeo();
  return buildPracticeSetsIndexMetadata(practiceSets, "/acme-practice-sets");
}

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
