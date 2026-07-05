import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Shared server-side metadata/JSON-LD generator for all 4 Practice Sets
// route depths — each page.tsx calls this with its own canonical path. The
// original client-fetched this same practice-set list purely to build a
// dynamic ItemList JSON-LD; fetching it here means that JSON-LD (and a
// baseline title/description) are present in the initial server HTML
// instead, while the actual interactive drill-down still happens in
// PracticeSetsClient exactly as before.
export type PracticeSet = { _id: string; title: string; description?: string };
export type PracticeTopic = { _id: string; title: string };

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

// Categories ("practice topics") within a single practice set — used to give
// the [setId] and [categoryId] routes their own real title/description
// instead of reusing the index-level generic copy.
export async function fetchPracticeTopicsForSeo(setId: string): Promise<PracticeTopic[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/practice-topic/${setId}`, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

// Question count for a single named topic within a category — used for the
// deepest [topicName] route so its description can cite an actual count.
export async function fetchTopicQuestionCount(categoryId: string, topicName: string): Promise<number> {
  try {
    const res = await fetch(`${BASE_URL}/api/questions/practice-topic/${categoryId}/topics/${encodeURIComponent(topicName)}`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return 0;
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data.length : 0;
  } catch {
    return 0;
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

function withPracticeMeta(title: string, description: string, keywords: string, canonicalPath: string): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: { type: "website", title, description, url: canonicalPath, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
    twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
  };
}

// Index: /acme-practice-sets — names a handful of the real sets on offer
// instead of the flat generic line, while still degrading gracefully if the
// API returns nothing.
export function buildPracticeSetsIndexMetadata(practiceSets: PracticeSet[], canonicalPath: string): Metadata {
  const names = practiceSets.slice(0, 3).map((s) => s.title);
  const description = names.length
    ? `Practice ${practiceSets.length} MCA entrance question sets on ACME Academy, including ${names.join(", ")} — free topic-wise drills with instant solutions.`
    : practiceSetsMetadataBase.description;
  return withPracticeMeta(
    practiceSetsMetadataBase.title,
    description.length <= 165 ? description : practiceSetsMetadataBase.description,
    practiceSetsMetadataBase.keywords,
    canonicalPath
  );
}

// /acme-practice-sets/[setId] — real set title/description + its category count.
export function buildPracticeSetMetadata(set: PracticeSet | undefined, categories: PracticeTopic[], canonicalPath: string): Metadata {
  if (!set) return withPracticeMeta(practiceSetsMetadataBase.title, practiceSetsMetadataBase.description, practiceSetsMetadataBase.keywords, canonicalPath);

  const title = `${set.title} Practice Set | ACME Academy`;
  const categoryNames = categories.slice(0, 3).map((c) => c.title);
  const topicsPhrase = categoryNames.length ? ` across ${categories.length} topics like ${categoryNames.join(", ")}` : "";
  const description = set.description
    ? `${set.description} Practice ${set.title}${topicsPhrase} on ACME Academy with instant solutions.`
    : `Practice ${set.title} questions for MCA entrance exams${topicsPhrase} with step-by-step solutions on ACME Academy.`;

  return withPracticeMeta(title, description, `${set.title}, MCA Practice, ACME Academy Practice Set`, canonicalPath);
}

// /acme-practice-sets/[setId]/[categoryId] — real category + parent set title.
export function buildPracticeCategoryMetadata(set: PracticeSet | undefined, category: PracticeTopic | undefined, canonicalPath: string): Metadata {
  if (!set || !category) {
    return withPracticeMeta(practiceSetsMetadataBase.title, practiceSetsMetadataBase.description, practiceSetsMetadataBase.keywords, canonicalPath);
  }

  const title = `${category.title} Practice Questions – ${set.title} | ACME Academy`;
  const description = `Practice ${category.title} questions from ACME Academy's ${set.title} with instant answers and solutions for MCA entrance exam preparation.`;

  return withPracticeMeta(title, description, `${category.title}, ${set.title}, MCA Practice, ACME Academy`, canonicalPath);
}

// /acme-practice-sets/[setId]/[categoryId]/[topicName] — real topic name,
// parent category/set, and question count when the count fetch succeeds.
export function buildPracticeTopicMetadata(
  set: PracticeSet | undefined,
  category: PracticeTopic | undefined,
  topicName: string,
  questionCount: number,
  canonicalPath: string
): Metadata {
  if (!set || !category) {
    const title = `${topicName} Practice Questions | ACME Academy`;
    const description = `Practice ${topicName} questions with instant solutions for MCA entrance exam preparation on ACME Academy.`;
    return withPracticeMeta(title, description, `${topicName}, MCA Practice, ACME Academy`, canonicalPath);
  }

  const title = `${topicName} – ${category.title} Practice | ACME Academy`;
  const description = questionCount
    ? `Practice ${questionCount} ${topicName} questions from ${set.title}'s ${category.title} section with step-by-step solutions on ACME Academy.`
    : `Practice ${topicName} questions from ${set.title}'s ${category.title} section with step-by-step solutions on ACME Academy.`;

  return withPracticeMeta(title, description, `${topicName}, ${category.title}, ${set.title}, ACME Academy`, canonicalPath);
}
