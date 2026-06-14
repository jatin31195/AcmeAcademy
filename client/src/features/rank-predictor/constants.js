// Shared constants for the NIMCET Rank Predictor feature.

/** Base path under which all rank-predictor routes are mounted in the site. */
export const RP_BASE = "/nimcet-rank-predictor";

/** sessionStorage key holding the phone-OTP session for this flow. */
export const RP_AUTH_KEY = "rp_auth";

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
