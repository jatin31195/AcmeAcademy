// Ported 1:1 from client/src/config.js.
// Vite's import.meta.env.VITE_* -> Next.js process.env.NEXT_PUBLIC_* (same public/client-exposed semantics).
export const BASE_URL =
  process.env.NEXT_PUBLIC_NODEJS_BACKEND || "http://localhost:5000";

// Name kept exactly as `Flask_URL` (not FLASK_URL) to match every existing
// call site in the ported pages 1:1 during later phases.
export const Flask_URL =
  process.env.NEXT_PUBLIC_FLASK_BACKEND || "http://localhost:5001";

// Classplus (org: acmea) — used by lib/classplus.ts (Free Tests) and
// lib/classplus-courses.ts (homepage Our Courses). Called server-side only,
// so the hashkey never reaches the browser bundle. No hardcoded fallbacks —
// values must come from .env.local (never committed); see
// .env.local.example for the required keys.
export const CLASSPLUS_TEST_LIST_URL = process.env.CLASSPLUS_TEST_LIST_URL || "";
export const CLASSPLUS_HASHKEY = process.env.CLASSPLUS_HASHKEY || "";
export const CLASSPLUS_COURSE_PREVIEW_BASE_URL = process.env.CLASSPLUS_COURSE_PREVIEW_BASE_URL || "";
export const CLASSPLUS_COURSE_PREVIEW_URL = `${CLASSPLUS_COURSE_PREVIEW_BASE_URL}/${CLASSPLUS_HASHKEY}`;
export const CLASSPLUS_STORE_ORIGIN = process.env.CLASSPLUS_STORE_ORIGIN || "";
