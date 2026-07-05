import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { fetchPracticeSetsForSeo, fetchPracticeTopicsForSeo, buildPracticeSetsJsonLd, buildPracticeSetMetadata } from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";

export async function generateMetadata({ params }: { params: Promise<{ setId: string }> }): Promise<Metadata> {
  const { setId } = await params;
  const canonical = `/acme-practice-sets/${setId}`;
  const [practiceSets, categories] = await Promise.all([fetchPracticeSetsForSeo(), fetchPracticeTopicsForSeo(setId)]);
  const set = practiceSets.find((s) => s._id === setId);
  return buildPracticeSetMetadata(set, categories, canonical);
}

export default async function PracticeSetsBySetPage({ params }: { params: Promise<{ setId: string }> }) {
  const { setId } = await params;
  const practiceSets = await fetchPracticeSetsForSeo();
  const jsonLd = buildPracticeSetsJsonLd(practiceSets, `/acme-practice-sets/${setId}`);

  return (
    <>
      <Script id="ld-practice-sets" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <PracticeSetsClient setId={setId} />
      </Suspense>
    </>
  );
}
