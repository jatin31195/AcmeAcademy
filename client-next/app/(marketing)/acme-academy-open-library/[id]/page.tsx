import type { Metadata } from "next";
import Script from "next/script";
import { BASE_URL } from "@/lib/config";
import { LibraryContentBody, type Section } from "@/components/library/library-content-body";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/pages/LibraryContent.jsx. The original did 3
// sequential/cascading client fetches (course meta, then subjects, then one
// topics call per subject). Here course meta + subjects fetch in parallel via
// Promise.all, and the per-subject topics calls also run in parallel — same
// data, faster, and (unlike the original) present in the initial server HTML.

type CourseMeta = { title: string; description?: string };
type Subject = { _id: string; title: string; emoji?: string };
type ApiTopic = { _id: string; title: string; links?: object; locked?: object; tests?: string[] };

async function fetchCourseMeta(id: string): Promise<CourseMeta> {
  try {
    const res = await fetch(`${BASE_URL}/api/courses/${id}`, { next: { revalidate: 600 } });
    if (!res.ok) return { title: "Course", description: "" };
    return await res.json();
  } catch {
    return { title: "Course", description: "" };
  }
}

async function fetchSections(id: string): Promise<Section[]> {
  try {
    const subjectsRes = await fetch(`${BASE_URL}/api/subjects/course/${id}`, { next: { revalidate: 600 } });
    if (!subjectsRes.ok) return [];
    const subjects: Subject[] = await subjectsRes.json();

    const sectionsData = await Promise.all(
      subjects.map(async (subject) => {
        const topicsRes = await fetch(`${BASE_URL}/api/topics/subject/${subject._id}`, { next: { revalidate: 600 } });
        const topicsJson: ApiTopic[] = topicsRes.ok ? await topicsRes.json() : [];
        return {
          id: subject._id,
          title: subject.title,
          emoji: subject.emoji || "📘",
          groups: [
            {
              id: `${subject._id}-group`,
              title: "Topics",
              topics: topicsJson.map((t) => ({
                ...t,
                completed: false,
                markedForRevision: false,
                notes: "",
              })),
            },
          ],
        };
      })
    );

    return sectionsData;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const courseMeta = await fetchCourseMeta(id);
  const title = `${courseMeta.title} | ACME Academy Open Library`;
  const description =
    courseMeta.description || `Access free MCA entrance course materials, video lectures, notes, and assignments for ${courseMeta.title} by ACME Academy.`;
  const url = `https://www.acmeacademy.in/acme-academy-open-library/${id}`;

  return {
    title,
    description,
    keywords: `${courseMeta.title}, MCA notes, MCA lectures, NIMCET preparation, CUET PG MCA materials, ACME Academy`,
    alternates: { canonical: `/acme-academy-open-library/${id}` },
    openGraph: { type: "website", title, description, url, siteName: SITE_NAME, locale: OG_LOCALE, images: ["https://www.acmeacademy.in/logo.png"] },
    twitter: { card: "summary_large_image", title, description, site: TWITTER_HANDLE, images: ["https://www.acmeacademy.in/logo.png"] },
  };
}

export default async function LibraryContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [courseMeta, sections] = await Promise.all([fetchCourseMeta(id), fetchSections(id)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseMeta.title,
    description: courseMeta.description || "Comprehensive MCA entrance preparation course with notes, lectures, and tests.",
    url: `https://www.acmeacademy.in/acme-academy-open-library/${id}`,
    provider: {
      "@type": "EducationalOrganization",
      name: "ACME Academy",
      url: "https://www.acmeacademy.in",
      logo: "https://www.acmeacademy.in/logo.png",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Online",
      courseWorkload: `${sections.length} subjects`,
      inLanguage: "en",
      provider: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
    },
    hasPart: sections.map((section, i) => ({
      "@type": "CreativeWork",
      position: i + 1,
      name: section.title,
      description: `Topics and learning resources for ${section.title}.`,
      about: section.emoji ? section.emoji : "Study module",
      learningResourceType: "Educational material",
      educationalUse: "Study",
      isAccessibleForFree: true,
      provider: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
        url: "https://www.acmeacademy.in",
      },
      hasPart: section.groups.flatMap((g, idx) =>
        g.topics.map((topic, j) => ({
          "@type": "LearningResource",
          position: `${i + 1}.${idx + 1}.${j + 1}`,
          name: topic.title,
          url: `https://www.acmeacademy.in/acme-academy-open-library/${id}#${topic._id}`,
          educationalLevel: "Postgraduate Entrance",
          inLanguage: "en",
          isAccessibleForFree: true,
          learningResourceType: "Video / Notes / Assignment",
          about: section.title,
          provider: {
            "@type": "EducationalOrganization",
            name: "ACME Academy",
            url: "https://www.acmeacademy.in",
          },
        }))
      ),
    })),
  };

  return (
    <>
      <Script id="ld-library-course" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LibraryContentBody initialSections={sections} courseTitle={courseMeta.title} courseDescription={courseMeta.description} />
    </>
  );
}
