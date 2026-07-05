import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { BASE_URL } from "@/lib/config";
import { ViewSolutionButton } from "@/components/questions/view-solution-button";

// Ported from client/src/pages/QuestionSEOPage.jsx — the flagship SEO fix of
// this migration. The original fetched by slug in a useEffect *after* mount,
// meaning crawlers relying on raw HTML got nothing without the prerender-node
// workaround. Here the fetch happens server-side before render, so the
// question content, metadata, and JSON-LD are all present in the initial
// HTML. No generateStaticParams(): with a potentially large/growing question
// bank, enumerating every slug at build time isn't appropriate — pages
// instead render on first request and are cached per `revalidate` below
// (on-demand ISR, dynamicParams defaults to true).
//
// The ONLY Client Island is the "View Solution" scroll button. Note: the
// original's button called `document.getElementById("solution-section")`,
// but no element with that id existed anywhere in the original file — a
// pre-existing dead/no-op button. Preserved as-is (id intentionally not
// added to the explanation section below), not silently fixed.

type Question = {
  question: string;
  solutionText?: string;
  tags?: string[];
  topic?: string;
  image?: string;
  options?: string[];
  answer?: string;
  solutionVideo?: string;
  discussion?: { user: string; comment: string; createdAt: string }[];
};

const cleanText = (htmlOrText: string = "") => String(htmlOrText).replace(/<[^>]+>/g, "").trim();

async function fetchQuestion(slug: string): Promise<Question | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/questions/q/slug/${slug}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) return {};

  const title = `${cleanText(question.question)} | ACME Academy`;
  const description = cleanText(question.solutionText)?.slice(0, 150) || "Solve this problem and learn smarter with ACME Academy.";
  const keywords = question.tags?.join(", ") || question.topic || "MCA Preparation";
  const url = `https://www.acmeacademy.in/questions/${slug}`;
  const image = question.image || "https://www.acmeacademy.in/logo.png";

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/questions/${slug}` },
    openGraph: { type: "website", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function QuestionSEOPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = await fetchQuestion(slug);
  if (!question) notFound();

  const url = `https://www.acmeacademy.in/questions/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: cleanText(question.question),
    text: cleanText(question.question),
    answerCount: question.answer ? 1 : 0,
    acceptedAnswer: question.answer
      ? {
          "@type": "Answer",
          text: cleanText(question.solutionText || question.answer),
          url,
        }
      : undefined,
    author: {
      "@type": "Organization",
      name: "ACME Academy",
      url: "https://www.acmeacademy.in",
    },
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <Script id="ld-question" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-snug">{cleanText(question.question)}</h1>

        {question.image && (
          // eslint-disable-next-line @next/next/no-img-element -- API-sourced image, dimensions unknown
          <img
            src={question.image}
            alt={cleanText(question.question)}
            className="w-full max-w-lg rounded-lg shadow-md mb-6 mx-auto"
          />
        )}

        {question.options && question.options.length > 0 && (
          <ul className="mb-4 space-y-2">
            {question.options.map((opt, i) => (
              <li key={i} className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-800 dark:text-gray-200">
                <strong>{String.fromCharCode(65 + i)}.</strong> {opt}
              </li>
            ))}
          </ul>
        )}

        {question.answer && (
          <h2 className="mt-6 font-semibold text-green-600 dark:text-green-400">✅ Correct Answer: {question.answer}</h2>
        )}

        <section className="mt-6 prose dark:prose-invert">
          <h3 className="font-semibold text-lg mb-2">Explanation</h3>
          {question.solutionText ? (
            <p>{question.solutionText}</p>
          ) : (
            <p className="italic text-gray-600">Solution will be added soon.</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <ViewSolutionButton hasSolution={!!question.solutionText} />

            {question.solutionVideo ? (
              <a
                href={question.solutionVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                Watch Video Solution
              </a>
            ) : (
              <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                Video Solution Coming Soon
              </button>
            )}
          </div>
        </section>

        {question.discussion && question.discussion.length > 0 && (
          <section className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Recent Discussion</h3>
            <ul className="space-y-3">
              {question.discussion.map((d, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <p className="text-sm font-medium">{d.user}</p>
                  <p className="text-sm mt-1">{d.comment}</p>
                  <span className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-center mt-10 text-gray-700 dark:text-gray-300 font-medium">
          🎯 Happy Preparation — <span className="text-blue-600">ACME Academy</span>
        </p>
      </main>
    </>
  );
}
