import type { Metadata } from "next";
import Script from "next/script";
import { BASE_URL } from "@/lib/config";
import { PYQListClient } from "@/components/pyq/pyq-list-client";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

type Pyq = { _id: string; title: string; exam: string; year: string; description?: string };

async function fetchPyqs(): Promise<Pyq[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/pyqs/`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: "Previous Year MCA Entrance Question Papers | ACME Academy",
  description:
    "Download and practice Previous Year Question Papers (PYQs) for NIMCET, CUET-PG, MAH-CET, JMI, BIT, and other MCA entrance exams. Prepare effectively with ACME Academy.",
  keywords: "NIMCET PYQ, CUET-PG question papers, MAH-CET MCA papers, JMI MCA PYQs, BIT MCA papers, ACME Academy PYQs, previous year MCA papers",
  alternates: { canonical: "/pyq" },
  openGraph: {
    type: "website",
    title: "Previous Year MCA Entrance Question Papers | ACME Academy",
    description:
      "Download and practice Previous Year Question Papers (PYQs) for NIMCET, CUET-PG, MAH-CET, JMI, BIT, and other MCA entrance exams. Prepare effectively with ACME Academy.",
    url: "/pyq",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Previous Year MCA Entrance Question Papers | ACME Academy",
    description:
      "Download and practice Previous Year Question Papers (PYQs) for NIMCET, CUET-PG, MAH-CET, JMI, BIT, and other MCA entrance exams. Prepare effectively with ACME Academy.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

export default async function PYQPage() {
  const pyqs = await fetchPyqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Previous Year MCA Entrance Question Papers",
    description: "Browse and download PYQs from NIMCET, CUET-PG, MAH-CET, and other MCA entrance exams. Curated by ACME Academy.",
    url: "https://www.acmeacademy.in/pyq",
    numberOfItems: pyqs.length,
    itemListElement: pyqs.slice(0, 10).map((pyq, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.acmeacademy.in/pyq/${pyq._id}`,
      name: `${pyq.exam} ${pyq.year} Question Paper`,
      description: pyq.description || `${pyq.exam} ${pyq.year} MCA entrance PYQ`,
      dateCreated: pyq.year ? `${pyq.year}-01-01` : undefined,
      additionalType: "https://schema.org/Dataset",
      inLanguage: "en",
      publisher: {
        "@type": "Organization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
    })),
  };

  return (
    <>
      <Script id="ld-pyq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PYQListClient initialPyqs={pyqs} />
    </>
  );
}
