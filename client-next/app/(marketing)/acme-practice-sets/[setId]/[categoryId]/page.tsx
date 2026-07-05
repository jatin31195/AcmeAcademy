import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { fetchPracticeSetsForSeo, buildPracticeSetsJsonLd, practiceSetsMetadataBase } from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";

export async function generateMetadata({ params }: { params: Promise<{ setId: string; categoryId: string }> }): Promise<Metadata> {
  const { setId, categoryId } = await params;
  const canonical = `/acme-practice-sets/${setId}/${categoryId}`;
  return {
    ...practiceSetsMetadataBase,
    alternates: { canonical },
    openGraph: { type: "website", ...practiceSetsMetadataBase, url: canonical, images: ["https://www.acmeacademy.in/logo.png"] },
    twitter: { card: "summary_large_image", ...practiceSetsMetadataBase, images: ["https://www.acmeacademy.in/logo.png"] },
  };
}

export default async function PracticeSetsByCategoryPage({ params }: { params: Promise<{ setId: string; categoryId: string }> }) {
  const { setId, categoryId } = await params;
  const practiceSets = await fetchPracticeSetsForSeo();
  const jsonLd = buildPracticeSetsJsonLd(practiceSets, `/acme-practice-sets/${setId}/${categoryId}`);

  return (
    <>
      <Script id="ld-practice-sets" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <PracticeSetsClient setId={setId} categoryId={categoryId} />
      </Suspense>
    </>
  );
}
