import type { Metadata } from "next";

// Shared site-wide SEO constants so OpenGraph/Twitter metadata stays
// consistent across every page instead of being retyped per file.
export const SITE_NAME = "ACME Academy";
export const OG_LOCALE = "en_IN";
export const TWITTER_HANDLE = "@acmeacademy";

// Site-wide default robots directive (index/follow + explicit Googlebot
// preview allowances). Pages that need noindex (auth/session-gated routes)
// already set their own `robots` field, which fully overrides this default
// per Next.js metadata resolution rules.
export const DEFAULT_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};
