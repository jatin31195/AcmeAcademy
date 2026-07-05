// Ported verbatim from client/src/features/rank-predictor/constants.js.

/** Base path under which all rank-predictor routes are mounted in the site. */
export const RP_BASE = "/nimcet-rank-predictor";

/** sessionStorage key holding the phone-OTP session for this flow. */
export const RP_AUTH_KEY = "rp_auth";

/**
 * sessionStorage key used to carry the submitted-form payload from the Form
 * page to the Report page. The original React Router app passed this via
 * `navigate(path, { state: payload })`, which has no equivalent between two
 * separate Next.js pages (Client Components on different routes don't share
 * router state) — sessionStorage is the minimal substitute, using the same
 * per-tab-session storage the auth step (RP_AUTH_KEY) already relies on.
 */
export const RP_REPORT_DATA_KEY = "rp_report_data";

/**
 * ACME Academy branding used across the report, share cards and PDF.
 * Update CONTACT_PHONE / CONTACT_EMAIL with the real values when available.
 */
export const ACME = {
  name: "ACME Academy",
  productName: "ACME Academy NIMCET Rank Predictor",
  reportTitle: "ACME Academy Official NIMCET Prediction Report",
  reportSubtitle: "NIMCET Counselling Readiness Report",
  tagline: "India's Trusted NIMCET Guidance Platform",
  website: "https://acmeacademy.in",
  websiteLabel: "acmeacademy.in",
  contactPhone: "+91-XXXXXXXXXX", // TODO: replace with real support number
  contactEmail: "info@acmeacademy.in", // TODO: replace with real support email
  trustLine: "Trusted by NIMCET Aspirants Across India",
  methodologyLine: "Based on Historical NIMCET Cutoff Analysis",
  poweredBy: "Powered by ACME Academy",
};
