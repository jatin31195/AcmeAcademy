import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";
import { optimizeCloudinaryUrl, getResultLabel, getResultAltText, getAnchorId, PAST_GALLERY_SLUG, type ResultDoc } from "@/lib/results-helpers";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Server-side metadata/JSON-LD builder for all 3 Results route variants.
// Fetches the same "main" result set the original computed client-side for
// a given exam+year, so the initial HTML for whichever URL a crawler hits
// already has a real title/description and a Person/BreadcrumbList/FAQPage
// JSON-LD graph — the biggest data-flow win of this migration (Results was
// flagged as the highest-risk page precisely because none of this existed
// server-side before).
export async function fetchMainResults(exam: string, year: string): Promise<ResultDoc[]> {
  if (year === "PastGallery" || year === PAST_GALLERY_SLUG) {
    try {
      const res = await fetch(`${BASE_URL}/api/results/gallery/all`, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }
  if (year === "All") return [];
  try {
    const res = await fetch(`${BASE_URL}/api/results/${exam.toLowerCase()}/${year}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export function buildResultsMetadata(exam: string, year: string, canonicalPath: string): Metadata {
  const title = `${exam || "NIMCET"} ${year} Top Results | ACME Academy – Best MCA Coaching`;
  const description = `See ACME Academy's top ${exam} ${year} results and AIR ranks. India's most trusted NIMCET coaching with proven selections every year.`;

  return {
    title,
    description,
    keywords: "NIMCET results, NIMCET AIR, ACME Academy results, MCA entrance results",
    alternates: { canonical: canonicalPath },
    openGraph: { type: "website", title, description, url: canonicalPath, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
    twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
  };
}

const RESULTS_BASE_URL = "https://www.acmeacademy.in/acme-academy-results";

export function buildResultsJsonLd(mainResults: ResultDoc[], exam: string, year: string, canonicalUrl: string) {
  const isFilteredView = year !== "All" && year !== "PastGallery" && year !== PAST_GALLERY_SLUG && exam !== "MIXED";

  // BreadcrumbList: Home -> Results -> Exam -> Year, the last two levels
  // only added when this is a specific exam+year view (isFilteredView) —
  // there's no dedicated exam-only route, so per Google's guidance that
  // only the final crumb must match the page URL exactly, the Exam and
  // Year crumbs both point at the same canonicalUrl.
  const breadcrumbItems: { "@type": string; position: number; name: string; item: string }[] = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.acmeacademy.in/" },
    { "@type": "ListItem", position: 2, name: "Results", item: RESULTS_BASE_URL },
  ];
  if (isFilteredView) {
    breadcrumbItems.push({ "@type": "ListItem", position: 3, name: exam, item: canonicalUrl });
    breadcrumbItems.push({ "@type": "ListItem", position: 4, name: String(year), item: canonicalUrl });
  }

  const faqItems: { q: string; a: string }[] = [];
  if (isFilteredView && mainResults.length > 0) {
    const top = mainResults[0];
    const topLabel = getResultLabel(top, exam);
    faqItems.push(
      {
        q: `Who secured the top rank in ${exam} ${year} from ACME Academy?`,
        a: `${top.name || "An ACME Academy student"} secured ${topLabel} in ${exam} ${year} — one of ${mainResults.length} ACME Academy ${exam} ${year} selections featured on this page.`,
      },
      {
        q: `How many ACME Academy students cleared ${exam} ${year}?`,
        a: `This page currently showcases ${mainResults.length} ACME Academy ${exam} ${year} results, including All India Ranks and scores achieved by our students.`,
      }
    );
    if (mainResults.length > 1) {
      const last = mainResults[mainResults.length - 1];
      faqItems.push({
        q: `What rank range have ACME Academy toppers achieved in ${exam} ${year}?`,
        a: `ACME Academy ${exam} ${year} results shown here range from ${topLabel} up to ${getResultLabel(last, exam)}.`,
      });
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
        logo: "https://www.acmeacademy.in/logo.png",
        description: "ACME Academy is India's leading institute for NIMCET preparation, producing top ranks every year.",
        department: {
          "@type": "EducationalOccupationalProgram",
          educationalCredentialAwarded: "MCA Entrance Coaching",
        },
        alumni: mainResults.map((r) => {
          const anchorUrl = `${canonicalUrl}#${getAnchorId(r)}`;
          const rawImage = r.photoUrl || r.url;
          const optimizedImage = optimizeCloudinaryUrl(rawImage, 800) || rawImage;
          return {
            "@type": "Person",
            "@id": anchorUrl,
            mainEntityOfPage: anchorUrl,
            name: r.name || r.eventName,
            award: `${getResultLabel(r, exam)} in ${(r.exam || exam).toUpperCase()} ${r.year}`,
            alumniOf: { "@type": "EducationalOrganization", name: "ACME Academy" },
            image: {
              "@type": "ImageObject",
              contentUrl: optimizedImage || "https://www.acmeacademy.in/logo.png",
              url: optimizedImage || "https://www.acmeacademy.in/logo.png",
              caption: getResultAltText(r, exam),
            },
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
      {
        "@type": "CollectionPage",
        name: `${exam} ${year} Results | ACME Academy`,
        url: canonicalUrl,
        description: `ACME Academy ${exam} ${year} student results — All India Ranks, scores, and topper photos.`,
        isPartOf: { "@type": "WebSite", name: "ACME Academy", url: "https://www.acmeacademy.in" },
        mainEntity: {
          "@type": "ItemList",
          name: `${exam} ${year} Top Results`,
          numberOfItems: mainResults.length,
          itemListElement: mainResults.map((r, i) => {
            const anchorUrl = `${canonicalUrl}#${getAnchorId(r)}`;
            return {
              "@type": "ListItem",
              position: i + 1,
              url: anchorUrl,
              name: `${r.name || r.eventName || "ACME Academy student"} — ${getResultLabel(r, exam)}`,
            };
          }),
        },
      },
      ...(faqItems.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}
