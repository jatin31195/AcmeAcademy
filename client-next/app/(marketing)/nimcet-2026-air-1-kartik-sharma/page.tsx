import type { Metadata } from "next";
import Script from "next/script";
import rankBannerImage from "@/assets/images/rank_banner.jpeg";
import kartikSharmaImage from "@/assets/images/kartik_sharma.jpeg";
import patrikaImage from "@/assets/images/patrika.jpeg";
import { Air1StoryContent } from "@/components/air1story/air1story-content";
import { cldOptimize, cldUploadDate } from "@/lib/cloudinary";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

const url = "https://www.acmeacademy.in/nimcet-2026-air-1-kartik-sharma";
const HERO_IMAGE = rankBannerImage.src;
const PORTRAIT_IMAGE = kartikSharmaImage.src;
const PATRIKA_CLIPPING_IMAGE = patrikaImage.src;
const HERO_IMAGE_URL = new URL(HERO_IMAGE, "https://www.acmeacademy.in").toString();
const YOUTUBE_VIDEO_ID = "BpV5Y93HVzE";
const YOUTUBE_START_SECONDS = 381;
const KARTIK_LINKEDIN_URL = "https://www.linkedin.com/in/kartik-sharma-4756362a1/";
const KARTIK_SUCCESS_VIDEO = "https://res.cloudinary.com/dv69cqfru/video/upload/v1783092183/0703_1_cgt0is.mp4";
const KARTIK_SUCCESS_VIDEO_POSTER =
  "https://res.cloudinary.com/dv69cqfru/image/upload/v1783092934/Screenshot_2026-07-03_210401_jqcf1p.png";
const KARTIK_VOICE_VIDEO = "https://res.cloudinary.com/dv69cqfru/video/upload/v1783226482/0703_1_qjuo31.mp4";
const KARTIK_VOICE_VIDEO_POSTER = KARTIK_VOICE_VIDEO.replace(/\.mp4$/, ".jpg");
const youtubeThumbnail = `https://i.ytimg.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;

// Ported from client/src/pages/Air1Story.jsx. Its jsonLd was wrapped in
// useMemo([youtubeThumbnail]) but every value inside is actually a
// deterministic constant (not derived from state/props) — so it's computed
// here as a plain build-time constant instead, which is strictly more
// reliable for SEO (guaranteed present in the initial server-rendered HTML,
// same values as before). The <link rel="preload"> hero-image hint, ported
// from the original's second <Helmet>, is rendered as a plain JSX <link> in
// this Server Component's body — React 19 automatically hoists <link>/<meta>
// tags rendered anywhere in the tree into <head>, so no client-only Helmet
// mechanism is needed for it anymore.
export const metadata: Metadata = {
  title: "ACME Academy's AIR 1 in NIMCET 2026 | Kartik Sharma's Success Story",
  description:
    "ACME Academy produced AIR 1 in NIMCET 2026 — topper Kartik Sharma credits ACME Academy's mentorship, test series, and Quant lectures for his rank. Read his journey, in his own voice.",
  keywords:
    "ACME Academy AIR 1, ACME Academy NIMCET 2026 AIR 1, ACME Academy NIMCET topper, NIMCET 2026 AIR 1, NIMCET AIR 1, NIMCET topper, NIMCET rank 1, Kartik Sharma NIMCET, NIMCET success story, NIMCET preparation strategy",
  alternates: {
    canonical: "/nimcet-2026-air-1-kartik-sharma",
  },
  openGraph: {
    type: "article",
    title: "ACME Academy's AIR 1 in NIMCET 2026 | Kartik Sharma's Success Story",
    description:
      "ACME Academy produced AIR 1 in NIMCET 2026 — topper Kartik Sharma credits ACME Academy's mentorship, test series, and Quant lectures for his rank. Read his journey, in his own voice.",
    url,
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: [HERO_IMAGE_URL],
    publishedTime: "2026-07-02T00:00:00+05:30",
    modifiedTime: "2026-07-03T00:00:00+05:30",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACME Academy's AIR 1 in NIMCET 2026 | Kartik Sharma's Success Story",
    description:
      "ACME Academy produced AIR 1 in NIMCET 2026 — topper Kartik Sharma credits ACME Academy's mentorship, test series, and Quant lectures for his rank. Read his journey, in his own voice.",
    site: TWITTER_HANDLE,
    images: [HERO_IMAGE_URL],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": `${url}#person`,
      "@type": "Person",
      name: "Kartik Sharma",
      award: "AIR 1, NIMCET 2026",
      description: "NIMCET 2026 All India Rank 1, ACME Academy student.",
      image: { "@id": `${url}#image-portrait` },
      sameAs: [KARTIK_LINKEDIN_URL],
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
    },
    {
      "@id": `${url}#article`,
      "@type": "Article",
      headline: "ACME Academy's Kartik Sharma Secures AIR 1 in NIMCET 2026",
      description:
        "ACME Academy student Kartik Sharma secured All India Rank 1 in NIMCET 2026, topping the national merit list, crediting ACME Academy's mentorship and test series.",
      keywords:
        "ACME Academy AIR 1, ACME Academy NIMCET 2026 AIR 1, ACME Academy NIMCET topper, NIMCET 2026 AIR 1, NIMCET AIR 1, NIMCET topper, NIMCET rank 1, Kartik Sharma NIMCET, NIMCET success story",
      datePublished: "2026-07-02T00:00:00+05:30",
      dateModified: "2026-07-03T00:00:00+05:30",
      about: { "@id": `${url}#person` },
      image: { "@id": `${url}#image-poster` },
      video: [{ "@id": `${url}#video-interview` }, { "@id": `${url}#video-story` }, { "@id": `${url}#video-voice` }],
      mentions: [
        {
          "@type": "Thing",
          name: "NIMCET (NIT MCA Common Entrance Test)",
          sameAs: ["https://nimcet.admissions.nic.in/", "https://en.wikipedia.org/wiki/NIT_MCA_Common_Entrance_Test"],
        },
      ],
      author: {
        "@type": "Organization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
      publisher: {
        "@type": "Organization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
        logo: {
          "@type": "ImageObject",
          url: "https://www.acmeacademy.in/logo.png",
        },
      },
      mainEntityOfPage: url,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#air1-hero-heading", "#air1-story-intro", "#air1-testimonial-quote"],
      },
    },
    {
      "@id": `${url}#video-interview`,
      "@type": "VideoObject",
      name: "Kartik Sharma NIMCET 2026 AIR 1 — Interview Coverage",
      description: "Video coverage discussing ACME Academy's NIMCET 2026 AIR 1 result, Kartik Sharma.",
      thumbnailUrl: [youtubeThumbnail],
      uploadDate: "2026-06-30T00:00:00+05:30",
      embedUrl: `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?start=${YOUTUBE_START_SECONDS}`,
    },
    {
      "@id": `${url}#video-story`,
      "@type": "VideoObject",
      name: "Kartik Sharma — NIMCET 2026 AIR 1 Success Story",
      description: "Kartik Sharma, ACME Academy student, shares his NIMCET 2026 AIR 1 success story in his own words.",
      thumbnailUrl: [cldOptimize(KARTIK_SUCCESS_VIDEO_POSTER)],
      uploadDate: cldUploadDate(KARTIK_SUCCESS_VIDEO),
      contentUrl: KARTIK_SUCCESS_VIDEO,
    },
    {
      "@id": `${url}#video-voice`,
      "@type": "VideoObject",
      name: "Kartik Sharma — In His Own Voice",
      description: "Kartik Sharma, ACME Academy student, speaks about his NIMCET 2026 AIR 1 success in his own voice.",
      thumbnailUrl: [cldOptimize(KARTIK_VOICE_VIDEO_POSTER)],
      uploadDate: cldUploadDate(KARTIK_VOICE_VIDEO),
      contentUrl: KARTIK_VOICE_VIDEO,
    },
    {
      "@id": `${url}#image-poster`,
      "@type": "ImageObject",
      contentUrl: HERO_IMAGE,
      url: HERO_IMAGE,
      description: "ACME Academy NIMCET 2026 AIR 1 achievement poster — Kartik Sharma",
      name: "NIMCET 2026 AIR 1 — Kartik Sharma",
    },
    {
      "@id": `${url}#image-portrait`,
      "@type": "ImageObject",
      contentUrl: PORTRAIT_IMAGE,
      url: PORTRAIT_IMAGE,
      description: "Kartik Sharma, ACME Academy student, AIR 1 in NIMCET 2026 entrance exam",
      name: "Kartik Sharma — NIMCET 2026 AIR 1",
    },
    {
      "@id": `${url}#image-patrika`,
      "@type": "ImageObject",
      contentUrl: PATRIKA_CLIPPING_IMAGE,
      url: PATRIKA_CLIPPING_IMAGE,
      description: "National newspaper coverage of ACME Academy's NIMCET 2026 AIR 1 achievement",
      name: "Patrika Coverage — ACME Academy NIMCET 2026 AIR 1",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.acmeacademy.in/home" },
        { "@type": "ListItem", position: 2, name: "Results", item: "https://www.acmeacademy.in/acme-academy-results" },
        { "@type": "ListItem", position: 3, name: "NIMCET 2026 AIR 1 — Kartik Sharma", item: url },
      ],
    },
  ],
};

export default function Air1StoryPage() {
  return (
    <>
      <Script id="ld-air1story" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <link rel="preload" as="image" href={HERO_IMAGE} fetchPriority="high" />
      <Air1StoryContent />
    </>
  );
}
