// Ported 1:1 from client/src/config.js.
// Vite's import.meta.env.VITE_* -> Next.js process.env.NEXT_PUBLIC_* (same public/client-exposed semantics).
export const BASE_URL =
  process.env.NEXT_PUBLIC_NODEJS_BACKEND || "http://localhost:5000";

// Name kept exactly as `Flask_URL` (not FLASK_URL) to match every existing
// call site in the ported pages 1:1 during later phases.
export const Flask_URL =
  process.env.NEXT_PUBLIC_FLASK_BACKEND || "http://localhost:5001";
