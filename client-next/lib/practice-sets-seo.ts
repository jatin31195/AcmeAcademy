import { BASE_URL } from "@/lib/config";

// Shared server-side metadata/JSON-LD generator for all 4 Practice Sets
// route depths — each page.tsx calls this with its own canonical path. The
// original client-fetched this same practice-set list purely to build a
// dynamic ItemList JSON-LD; fetching it here means that JSON-LD (and a
// baseline title/description) are present in the initial server HTML
// instead, while the actual interactive drill-down still happens in
// PracticeSetsClient exactly as before.
export type PracticeSet = { _id: string; title: string; description?: string };

export async function fetchPracticeSetsForSeo(): Promise<PracticeSet[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/practice-set`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export function buildPracticeSetsJsonLd(practiceSets: PracticeSet[], canonicalPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MCA Entrance Practice Sets",
    description: "Interactive practice sets for MCA entrance preparation including Mathematics, Logical Reasoning, Computer Awareness, and English.",
    url: `https://www.acmeacademy.in${canonicalPath}`,
    numberOfItems: practiceSets.length,
    itemListElement: practiceSets.slice(0, 10).map((set, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://www.acmeacademy.in/acme-practice-sets/${set._id}`,
      name: set.title,
      description: set.description || `${set.title} - MCA Practice Set by ACME Academy`,
      publisher: {
        "@type": "Organization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
        logo: "https://www.acmeacademy.in/logo.png",
      },
      learningResourceType: "Practice Exercise",
      educationalLevel: "Postgraduate Entrance",
      provider: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        sameAs: "https://www.acmeacademy.in",
      },
    })),
    isPartOf: {
      "@type": "EducationalOccupationalProgram",
      name: "MCA Entrance Coaching Program",
      educationalCredentialAwarded: "MCA Admission",
      provider: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
    },
  };
}

export const practiceSetsMetadataBase = {
  title: "MCA Entrance Practice Sets | ACME Academy",
  description: "Boost your MCA entrance exam preparation with interactive practice sets from ACME Academy. Includes Mathematics, Logical Reasoning, Computer Concepts, and more.",
  keywords: "MCA Practice Sets, NIMCET Practice, CUET-PG Practice Questions, MCA Mock Tests, ACME Academy Practice, MCA Entrance Preparation",
};
