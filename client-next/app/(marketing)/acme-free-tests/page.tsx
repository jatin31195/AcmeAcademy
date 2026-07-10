import type { Metadata } from "next";
import Script from "next/script";
import { fetchFreeTests } from "@/lib/classplus";
import { FreeTestsClient } from "@/components/free-tests/free-tests-client";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

const PAGE_SIZE = 20;

const faqItems = [
  {
    question: "What is the ACME Free Test Series for NIMCET?",
    answer:
      "ACME Free Test Series is a carefully designed set of NIMCET practice tests, topic-wise tests, and full-length mock tests that help students experience the real exam pattern before the actual entrance exam.",
  },
  {
    question: "Is the ACME Free Test Series really free?",
    answer:
      "Yes. Students can attempt the free NIMCET test series and other MCA entrance practice tests without paying anything, making it ideal for self-study and early preparation.",
  },
  {
    question: "How does the ACME NIMCET mock test help in preparation?",
    answer:
      "Our mock tests mirror the latest NIMCET pattern, helping students build speed, improve accuracy, and understand their strengths and weaknesses across subjects.",
  },
  {
    question: "Do you provide previous year mock tests?",
    answer:
      "Yes. ACME offers practice tests based on previous year patterns and question trends so students can understand the difficulty level and expected question style.",
  },
  {
    question: "Are topic-wise tests available?",
    answer:
      "Absolutely. Students can attempt topic-wise tests for Mathematics, Computer Awareness, and Analytical Ability to strengthen weak areas and revise systematically.",
  },
  {
    question: "Are full-length tests included?",
    answer:
      "Yes. ACME provides full-length NIMCET mock tests for real exam simulation, time management, and stamina building.",
  },
  {
    question: "Do you provide solutions after the test?",
    answer:
      "Yes. Every test includes instant solutions and detailed explanations so students can learn from each attempt instead of simply scoring marks.",
  },
  {
    question: "Is there performance analysis after every test?",
    answer:
      "Yes. Students receive actionable performance insights, including strengths, weak areas, accuracy, and improvement areas for smarter preparation.",
  },
  {
    question: "Can I use these tests for rank prediction?",
    answer:
      "Yes. Regular practice through our mock tests helps students estimate their likely rank range and track their progress towards top NIMCET scores.",
  },
  {
    question: "How difficult are the ACME tests?",
    answer:
      "The tests are designed to match the current difficulty level of NIMCET and other MCA entrance exams, offering a realistic challenge without being unfair.",
  },
  {
    question: "Are these tests suitable for beginners?",
    answer:
      "Yes. Beginners can start with topic-wise practice, while advanced learners can move to full-length tests and mock analysis for stronger exam readiness.",
  },
  {
    question: "Can I prepare for MCA entrance without joining a full batch?",
    answer:
      "Yes. ACME Free Test Series is a strong self-study option for students who want high-quality practice, flexibility, and structured preparation.",
  },
  {
    question: "Do these tests follow the latest NIMCET syllabus?",
    answer:
      "Yes. The practice material is aligned with the latest exam pattern, section weightage, and NIMCET preparation expectations.",
  },
  {
    question: "Can I attempt the tests on mobile?",
    answer:
      "Yes. The tests are designed for online access so students can practice conveniently from a phone, tablet, or desktop.",
  },
  {
    question: "What makes ACME test series different from others?",
    answer:
      "ACME combines real exam simulation, detailed analysis, previous year patterns, and mentorship-driven preparation to make the experience more useful for serious aspirants.",
  },
];

export const metadata: Metadata = {
  title: "ACME Free Test Series | Acme Academy NIMCET Mock Tests & Practice Tests",
  description:
    "Explore ACME Free Test Series for NIMCET, CUET PG, and MAH-CET. Practice free tests, full-length mock tests, and topic-wise tests with detailed analysis.",
  keywords:
    "ACME Free Test Series, NIMCET test series, NIMCET mock test, free NIMCET test series, NIMCET online test, MCA entrance test series, free mock test",
  alternates: {
    canonical: "/acme-free-tests",
  },
  openGraph: {
    type: "website",
    title: "ACME Free Test Series | NIMCET Mock Tests & Practice Tests",
    description:
      "Explore ACME Free Test Series for NIMCET, CUET PG, and MAH-CET. Practice free tests, full-length mock tests, and topic-wise tests with detailed analysis.",
    url: "/acme-free-tests",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACME Free Test Series | NIMCET Mock Tests & Practice Tests",
    description:
      "Explore ACME Free Test Series for NIMCET, CUET PG, and MAH-CET. Practice free tests, full-length mock tests, and topic-wise tests with detailed analysis.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "ACME Free Test Series",
      url: "https://www.acmeacademy.in/acme-free-tests",
      description:
        "ACME Free Test Series offers NIMCET, CUET PG, and MAH-CET practice tests, full-length mock tests, and detailed analytics for serious MCA entrance aspirants.",
      isPartOf: {
        "@type": "WebSite",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.acmeacademy.in/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Open Library",
          item: "https://www.acmeacademy.in/acme-academy-open-library",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "ACME Free Test Series",
          item: "https://www.acmeacademy.in/acme-free-tests",
        },
      ],
    },
  ],
};

export default async function FreeTestsPage() {
  const initialData = await fetchFreeTests({ limit: PAGE_SIZE, offset: 0, search: "" });

  // ItemList of the tests actually visible on first load — real API data
  // only (name + attempt URL), never invented. Folders are skipped since
  // they aren't attemptable items themselves.
  const visibleTests = initialData.items.filter((item) => item.kind === "test");
  const testsItemListJsonLd =
    visibleTests.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Free NIMCET, CUET PG & MAH-CET Mock Tests",
          numberOfItems: visibleTests.length,
          itemListElement: visibleTests.map((test, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: test.name,
            url: test.attemptUrl,
          })),
        }
      : null;

  return (
    <>
      <Script
        id="ld-free-tests"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="ld-free-tests-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {testsItemListJsonLd && (
        <Script
          id="ld-free-tests-items"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(testsItemListJsonLd) }}
        />
      )}
      <FreeTestsClient initialData={initialData} pageSize={PAGE_SIZE} />
    </>
  );
}
