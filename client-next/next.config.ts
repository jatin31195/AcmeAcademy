import type { NextConfig } from "next";

// Phase 4 (Production Readiness) config. Everything here replicates existing
// production behavior from Server/app.js's Express middleware (security
// headers) and the legacy React Router catch-all (/home -> / redirect) —
// nothing here changes business logic, APIs, or page content.
const nextConfig: NextConfig = {
  // Matches Server/app.js's hardening middleware (X-Content-Type-Options,
  // X-Frame-Options, Referrer-Policy) applied to every response. HSTS itself
  // is intentionally left to the hosting platform (e.g. Vercel's edge
  // network already sends Strict-Transport-Security on the production
  // domain) rather than re-declared here, since setting it incorrectly at
  // the app layer during a staged cutover could pin browsers to HTTPS on a
  // hostname that isn't fully cut over yet.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // /home -> / permanent redirect (the approved canonical-route decision).
  // Implemented at the config level (resolved before any page renders)
  // rather than via a page.tsx calling permanentRedirect(), which is more
  // efficient and is the standard idiomatic place for a static, unconditional
  // redirect. Next.js's "permanent: true" redirects emit an HTTP 308 (Permanent
  // Redirect) rather than a literal 301 — there is no supported way to emit a
  // 301 from Next.js itself (this is a framework-level constraint, not a
  // choice made here). Search engines treat 308 identically to 301 for link
  // equity / ranking-signal consolidation, so this preserves the same SEO
  // outcome as the original 301.
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // Hide the "X-Powered-By: Next.js" response header (minor hardening,
  // matches the spirit of Express's existing security-header middleware).
  poweredByHeader: false,
};

export default nextConfig;
