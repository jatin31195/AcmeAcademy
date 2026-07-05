import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import {
  fetchPracticeSetsForSeo,
  fetchPracticeTopicsForSeo,
  fetchTopicQuestionCount,
  buildPracticeSetsJsonLd,
  buildPracticeTopicMetadata,
} from "@/lib/practice-sets-seo";
import { PracticeSetsClient } from "@/components/practice-sets/practice-sets-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ setId: string; categoryId: string; topicName: string }>;
}): Promise<Metadata> {
  const { setId, categoryId, topicName } = await params;
  const decodedTopic = decodeURIComponent(topicName);
  const canonical = `/acme-practice-sets/${setId}/${categoryId}/${topicName}`;
  const [practiceSets, categories, questionCount] = await Promise.all([
    fetchPracticeSetsForSeo(),
    fetchPracticeTopicsForSeo(setId),
    fetchTopicQuestionCount(categoryId, decodedTopic),
  ]);
  const set = practiceSets.find((s) => s._id === setId);
  const category = categories.find((c) => c._id === categoryId);
  return buildPracticeTopicMetadata(set, category, decodedTopic, questionCount, canonical);
}

export default async function PracticeSetsByTopicPage({
  params,
}: {
  params: Promise<{ setId: string; categoryId: string; topicName: string }>;
}) {
  const { setId, categoryId, topicName } = await params;
  const practiceSets = await fetchPracticeSetsForSeo();
  const jsonLd = buildPracticeSetsJsonLd(practiceSets, `/acme-practice-sets/${setId}/${categoryId}/${topicName}`);

  return (
    <>
      <Script id="ld-practice-sets" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense fallback={null}>
        <PracticeSetsClient setId={setId} categoryId={categoryId} topicName={decodeURIComponent(topicName)} />
      </Suspense>
    </>
  );
}
