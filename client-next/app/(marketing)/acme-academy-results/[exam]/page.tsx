import type { Metadata } from "next";
import Script from "next/script";
import { fetchMainResults, buildResultsMetadata, buildResultsJsonLd } from "@/lib/results-seo";
import { ResultsClient } from "@/components/results/results-client";
import { PAST_GALLERY_SLUG } from "@/lib/results-helpers";

// Ported from client/src/App.jsx's single-segment route
// "/acme-academy-results/:year" — in the original this route pattern was
// only ever meaningfully reached via the "past-gallery" slug (Results.jsx
// checks `year === PAST_GALLERY_SLUG` specifically); `exam` is absent from
// this URL shape, so it defaults to "NIMCET" exactly as the original's
// `exam?.toUpperCase() || "NIMCET"` did.
//
// This file lives at app/(marketing)/acme-academy-results/[exam]/page.tsx
// (not [year]) — Next.js requires every route sharing a path depth to use
// the identical dynamic-segment name, and the sibling two-segment route
// "/acme-academy-results/[exam]/[year]" already claims "[exam]" at this
// depth. The URL shape and behavior are unchanged; only the internal
// folder/param name matches its Next.js-mandated sibling.
const DEFAULT_EXAM = "NIMCET";

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const { exam: yearOrGallerySlug } = await params;
  const resolvedYear = yearOrGallerySlug === PAST_GALLERY_SLUG ? "PastGallery" : yearOrGallerySlug;
  const mainResults = await fetchMainResults(DEFAULT_EXAM, resolvedYear);
  return buildResultsMetadata(DEFAULT_EXAM, resolvedYear, `/acme-academy-results/${yearOrGallerySlug}`, mainResults);
}

export default async function ResultsByYearPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam: yearOrGallerySlug } = await params;
  const resolvedYear = yearOrGallerySlug === PAST_GALLERY_SLUG ? "PastGallery" : yearOrGallerySlug;
  const mainResults = await fetchMainResults(DEFAULT_EXAM, resolvedYear);
  const jsonLd = buildResultsJsonLd(mainResults, DEFAULT_EXAM, resolvedYear, `https://www.acmeacademy.in/acme-academy-results/${yearOrGallerySlug}`);

  return (
    <>
      <Script id="ld-results" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ResultsClient initialExam={DEFAULT_EXAM} initialYear={resolvedYear} initialResults={mainResults} />
    </>
  );
}
