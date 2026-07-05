import type { MetadataRoute } from "next";

// Replaces Server/public/robots.txt (previously served as a static file by
// Express's `express.static("./public")`). Disallow list preserved verbatim
// (including `/admin`, which never corresponded to a real route in the
// original React app either — a pre-existing defensive/no-op entry, not
// invented here) plus additions for every route this migration explicitly
// marked `robots: { index: false }` (Login/Signup, the authenticated app,
// and the session-gated Rank Predictor) — a completeness improvement:
// these pages were previously only kept out of search results via their own
// per-page noindex tag, with no matching Disallow signal.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/admin",
        "/login",
        "/signup",
        "/acme-test",
        "/acme-test-result",
        "/profile",
        "/nimcet-rank-predictor",
      ],
    },
    sitemap: "https://www.acmeacademy.in/sitemap.xml",
  };
}
