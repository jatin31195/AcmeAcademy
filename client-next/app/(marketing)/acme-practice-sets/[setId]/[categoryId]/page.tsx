import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { fetchPracticeSetsForSeo, fetchPracticeTopicsForSeo, buildPracticeSetsJsonLd, buildPracticeCategoryMetadata } from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";

export async function generateMetadata({ params }: { params: Promise<{ setId: string; categoryId: string }> }): Promise<Metadata> {
  const { setId, categoryId } = await params;
  const canonical = `/acme-practice-sets/${setId}/${categoryId}`;
  const [practiceSets, categories] = await Promise.all([fetchPracticeSetsForSeo(), fetchPracticeTopicsForSeo(setId)]);
  const set = practiceSets.find((s) => s._id === setId);
  const category = categories.find((c) => c._id === categoryId);
  return buildPracticeCategoryMetadata(set, category, canonical);
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
