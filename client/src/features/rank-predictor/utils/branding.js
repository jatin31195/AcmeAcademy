/**
 * branding.js — presentation helpers for report identity.
 * Generates a stable report number from existing student data (no Firestore,
 * no new fields) and a human-readable generation timestamp.
 */

/** Deterministic 6-digit code from the student's existing data. */
export function reportNumber(data) {
  const base = `${data?.regNo || ""}|${data?.phone || ""}|${data?.marks ?? ""}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  const code = (h % 900000) + 100000; // always 6 digits
  const year = new Date().getFullYear();
  return `ACME-NIM-${year}-${code}`;
}

/** "14 Jun 2026, 10:42 AM" style timestamp. */
export function reportTimestamp() {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
