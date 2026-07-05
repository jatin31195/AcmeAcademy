// Shared pure helpers extracted from client/src/pages/Results.jsx, used by
// both the Server page wrappers (metadata/JSON-LD) and ResultsClient
// (rendering) — same functions, same values, callable from both boundaries.

export type ResultDoc = {
  _id?: string;
  slug?: string;
  name?: string;
  eventName?: string;
  rank?: number;
  score?: number;
  exam?: string;
  year?: number | string;
  photoUrl?: string;
  url?: string;
  photoType?: string;
};

export const optimizeCloudinaryUrl = (url?: string, width?: number): string | undefined => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return url;
  if (url.includes("f_auto") || url.includes("q_auto")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

export const buildResultSrcSet = (url?: string): string | undefined => {
  if (!url || !url.includes("res.cloudinary.com/") || !url.includes("/upload/")) return undefined;
  if (url.includes("f_auto") || url.includes("q_auto")) return undefined;
  return [400, 800, 1200].map((w) => `${optimizeCloudinaryUrl(url, w)} ${w}w`).join(", ");
};

export const getResultLabel = (r: ResultDoc, fallbackExam?: string): string => {
  if (r.rank) return `AIR ${r.rank}`;
  if (r.score) return `Score ${r.score}`;
  return `${(r.exam || fallbackExam || "").toString().toUpperCase()} Selection`;
};

export const getResultAltText = (r: ResultDoc, fallbackExam?: string): string => {
  const label = getResultLabel(r, fallbackExam);
  const examName = (r.exam || fallbackExam || "").toString().toUpperCase();
  return `${r.name || r.eventName || "ACME Academy student"} — ${label}, ${examName} ${r.year || ""} topper photo, ACME Academy`
    .replace(/\s+/g, " ")
    .trim();
};

export const localSlugify = (str: string): string =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const getAnchorId = (r: ResultDoc): string =>
  r.slug || r._id || localSlugify(`${r.exam || "result"}-${r.year || ""}-${r.rank || r.score || r.name || "topper"}`);

export const PAST_GALLERY_SLUG = "past-gallery";

// Named toppers only, best-first: ranked results by rank ascending (AIR 1
// ahead of AIR 3), then unranked-but-scored results by score descending.
// Shared by the server metadata builder (results-seo.ts) and the on-page
// intro paragraph (ResultsClient) so both cite the same real names/order —
// never invented, and consistent between what Google indexes in the
// <title>/description and what it can read in the rendered HTML.
export const rankedToppers = (results: ResultDoc[]): ResultDoc[] =>
  results
    .filter((r) => r.name && (r.rank || r.score))
    .sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      if (a.rank) return -1;
      if (b.rank) return 1;
      return (b.score || 0) - (a.score || 0);
    });

// Plain comma-separated "AIR 1 Name" list, e.g. "AIR 1 Kartik Sharma, AIR 3
// Rahul Verma" — the caller supplies surrounding words ("and", "featuring",
// etc.) so this stays reusable across the title, description, and intro copy.
export const toppersList = (sorted: ResultDoc[], exam: string, count: number): string =>
  sorted
    .slice(0, count)
    .map((r) => `${getResultLabel(r, exam)} ${r.name}`)
    .join(", ");

// Real, visible on-page paragraph naming actual toppers — present in the
// initial HTML (not just <meta description>) since Google's snippet
// generation often prefers visible page text over the meta description.
export const buildToppersIntro = (results: ResultDoc[], exam: string, year: string): string | null => {
  const sorted = rankedToppers(results);
  if (!sorted.length) return null;
  const count = Math.min(3, sorted.length);
  const list = toppersList(sorted, exam, count);
  const suffix = sorted.length > count ? ", and many more successful selections" : " and successful selections";
  return `ACME Academy proudly presents the ${exam} ${year} Results, featuring ${list}${suffix}. Browse topper photos, ranks, scores, and previous-year achievements.`;
};
