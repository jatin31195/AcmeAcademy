import type { Metadata } from "next";
import Script from "next/script";
import { fetchMainResults, buildResultsMetadata, buildResultsJsonLd } from "@/lib/results-seo";
import { ResultsClient } from "@/components/results/results-client";

// Ported from client/src/pages/Results.jsx's default state (selectedExam
// defaults to "NIMCET", selectedYear defaults to "2025" when no URL params
// are present).
const DEFAULT_EXAM = "NIMCET";
const DEFAULT_YEAR = "2025";

export const metadata: Metadata = buildResultsMetadata(DEFAULT_EXAM, DEFAULT_YEAR, "/acme-academy-results");

export default async function ResultsIndexPage() {
  const mainResults = await fetchMainResults(DEFAULT_EXAM, DEFAULT_YEAR);
  const jsonLd = buildResultsJsonLd(mainResults, DEFAULT_EXAM, DEFAULT_YEAR, "https://www.acmeacademy.in/acme-academy-results");

  return (
    <>
      <Script id="ld-results" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ResultsClient initialExam={DEFAULT_EXAM} initialYear={DEFAULT_YEAR} initialResults={mainResults} />
    </>
  );
}
