import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/config";

// Replaces the legacy Express sitemap route (Server/src/routes/sitemap.js,
// mounted at GET /sitemap.xml). That route queried MongoDB directly inside
// the Node backend; this Next.js equivalent goes through the same public
// REST API every other Server Component page already uses (no new API
// surface, no direct DB access from the frontend).
//
// Differences from the legacy sitemap, all intentional:
// - Static URLs use "/" instead of "/home" (the approved canonical-route
//   decision — /home now 301(308)-redirects to / via next.config.ts).
// - Several public, fully-indexed pages the legacy sitemap never listed are
//   now included (exam-pattern, nimcet-2025, privacy/terms/refund,
//   score-checker) — a straightforward completeness improvement, not a
//   behavior change.
// - Question URLs are capped at the public `/api/questions` endpoint's own
//   200-document limit (`getAllQuestions`, sorted by createdAt desc), since
//   the legacy version queried Mongo directly with no limit. Adding an
//   uncapped bulk endpoint would be a backend/API change, out of scope for
//   this phase — flagged here and in the Phase 4 SEO report as a known,
//   accepted gap rather than silently reproduced or silently fixed.
const SITE_URL = "https://www.acmeacademy.in";

export const revalidate = 3600;

type WithUpdatedAt = { updatedAt?: string };

async function safeFetchArray<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, pyqs, practiceSets, questions, resultExams] = await Promise.all([
    safeFetchArray<{ _id: string } & WithUpdatedAt>(`${BASE_URL}/api/courses`),
    safeFetchArray<{ _id: string } & WithUpdatedAt>(`${BASE_URL}/api/pyqs/`),
    safeFetchArray<{ _id: string } & WithUpdatedAt>(`${BASE_URL}/api/practice-set`),
    safeFetchArray<{ slug: string } & WithUpdatedAt>(`${BASE_URL}/api/questions/`),
    safeFetchArray<string>(`${BASE_URL}/api/results/exams`),
  ]);

  // One sitemap entry per real (exam, year) combination that actually has
  // results, sourced from the same /api/results/exams + /api/results/years/:exam
  // endpoints ResultsClient already calls client-side — no new backend routes,
  // no invented URLs, no AIR/profile pages.
  const yearsByExam = await Promise.all(
    resultExams.map((exam) => safeFetchArray<number>(`${BASE_URL}/api/results/years/${exam.toLowerCase()}`))
  );
  const resultEntries: MetadataRoute.Sitemap = resultExams.flatMap((exam, i) =>
    (yearsByExam[i] || [])
      .filter((year) => typeof year === "number" && !Number.isNaN(year))
      .map((year) => ({
        url: `${SITE_URL}/acme-academy-results/${exam.toLowerCase()}/${year}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
  );

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact-acme-academy`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/acme-courses`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/acme-free-courses`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/acme-practice-sets`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/acme-academy-open-library`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/acme-academy-results`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/pyq`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/exam-pattern`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/exams-pattern/nimcet-2025`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/nimcet-2026-air-1-kartik-sharma`, changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-07-03") },
    { url: `${SITE_URL}/score-checker`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refund`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const questionEntries: MetadataRoute.Sitemap = questions
    .filter((q) => q.slug)
    .map((q) => ({
      url: `${SITE_URL}/questions/${q.slug}`,
      lastModified: q.updatedAt ? new Date(q.updatedAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const pyqEntries: MetadataRoute.Sitemap = pyqs.map((p) => ({
    url: `${SITE_URL}/pyq/${p._id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/acme-academy-open-library/${c._id}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const practiceSetEntries: MetadataRoute.Sitemap = practiceSets.map((p) => ({
    url: `${SITE_URL}/acme-practice-sets/${p._id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...questionEntries, ...pyqEntries, ...courseEntries, ...practiceSetEntries, ...resultEntries];
}
