import type { Metadata } from "next";
import Script from "next/script";
import { fetchFreeTests } from "@/lib/classplus";
import { FreeTestsClient } from "@/components/free-tests/free-tests-client";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

const PAGE_SIZE = 20;

export const metadata: Metadata = {
  title: "Free MCA Mock Tests | ACME Academy",
  description:
    "Attempt free NIMCET, CUET, MAH-CET, JAMIA and MCA entrance mock tests online with ACME Academy. Practice real exam-level questions and improve your rank.",
  keywords:
    "ACME Test Portal, ACME Academy free tests, free online test portal, NIMCET mock test, CUET-PG mock test, MAH-CET mock test, JAMIA MCA mock test, VIT MCA mock test",
  alternates: {
    canonical: "/acme-free-tests",
  },
  openGraph: {
    type: "website",
    title: "Free MCA Mock Tests | ACME Academy",
    description:
      "Attempt free NIMCET, CUET, MAH-CET, JAMIA and MCA entrance mock tests online with ACME Academy. Practice real exam-level questions and improve your rank.",
    url: "/acme-free-tests",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free MCA Mock Tests | ACME Academy",
    description:
      "Attempt free NIMCET, CUET, MAH-CET, JAMIA and MCA entrance mock tests online with ACME Academy. Practice real exam-level questions and improve your rank.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "ACME Academy Free Tests",
      url: "https://www.acmeacademy.in/acme-free-tests",
      description:
        "Free mock tests for NIMCET, CUET, MAH-CET, JAMIA, VIT MCA and other MCA entrance exams, powered by ACME Academy's test portal.",
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
          name: "ACME Academy Free Tests",
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
