import type { Metadata } from "next";
import Script from "next/script";
import { fetchMainResults, buildResultsMetadata, buildResultsJsonLd } from "@/lib/results-seo";
import { ResultsClient } from "@/components/results/results-client";

// Ported from client/src/App.jsx's two-segment route
// "/acme-academy-results/:exam/:year" — the canonical, fully-specified
// Results URL and the highest-value SEO target of the whole module.
export async function generateMetadata({ params }: { params: Promise<{ exam: string; year: string }> }): Promise<Metadata> {
  const { exam, year } = await params;
  return buildResultsMetadata(exam.toUpperCase(), year, `/acme-academy-results/${exam}/${year}`);
}

export default async function ResultsByExamYearPage({ params }: { params: Promise<{ exam: string; year: string }> }) {
  const { exam, year } = await params;
  const examUpper = exam.toUpperCase();
  const mainResults = await fetchMainResults(examUpper, year);
  const jsonLd = buildResultsJsonLd(mainResults, examUpper, year, `https://www.acmeacademy.in/acme-academy-results/${exam}/${year}`);

  return (
    <>
      <Script id="ld-results" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ResultsClient initialExam={examUpper} initialYear={year} initialResults={mainResults} />
    </>
  );
}
