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
