/**
 * collegeTiers.js — PRESENTATION ONLY.
 *
 * This does NOT change prediction, rank calculation, or cutoff data.
 * It simply re-groups the EXISTING `college_cutoffs.json` bands for the
 * student's category into Dream / Target / Safe buckets by comparing the
 * already-computed predicted AIR range against each college's existing
 * [low, high] band. No new data, no model, no statistics.
 *
 * Input `rr` is the exact range produced by the existing logic:
 *   { rankLow, rankHigh }  (or null when not available)
 */
import collegeCutoffs from "../data/college_cutoffs.json";

/** Rule-based "chance" purely from where the rank sits in/around the band. */
function classify(college, point) {
  const { low, high } = college;
  if (point <= low) {
    return { tier: "Safe", chance: 95 };
  }
  if (point <= high) {
    const frac = (point - low) / Math.max(1, high - low);
    return { tier: "Target", chance: Math.round(82 - frac * 30) }; // 82 → 52
  }
  if (point <= high * 1.15) {
    const frac = (point - high) / Math.max(1, high * 0.15);
    return { tier: "Dream", chance: Math.round(45 - frac * 22) }; // 45 → 23
  }
  return { tier: "Reach", chance: Math.max(5, Math.round(20 - ((point - high * 1.15) / Math.max(1, high)) * 20)) };
}

/**
 * Returns { dream, target, safe, reach, point } for the given category + range.
 * Each college keeps its original fields plus { tier, chance }.
 */
export function getTieredColleges(category, rr) {
  const list = collegeCutoffs[category] || [];
  if (!rr) return { dream: [], target: [], safe: [], reach: [], point: null };

  // Point estimate = midpoint of the EXISTING predicted range (no new prediction).
  const point = Math.round((rr.rankLow + rr.rankHigh) / 2);

  const classified = list.map((c) => ({ ...c, ...classify(c, point) }));

  return {
    point,
    dream:  classified.filter((c) => c.tier === "Dream").sort((a, b) => b.chance - a.chance),
    target: classified.filter((c) => c.tier === "Target").sort((a, b) => b.chance - a.chance),
    safe:   classified.filter((c) => c.tier === "Safe").sort((a, b) => a.low - b.low),
    reach:  classified.filter((c) => c.tier === "Reach").sort((a, b) => a.low - b.low),
  };
}

/**
 * Presentation-only admission chance (%) for a single college, derived from the
 * existing predicted range vs the college's existing [low, high] band.
 * Returns null when no range is available. No prediction logic is changed.
 */
export function chanceFor(college, rr) {
  if (!rr || !college) return null;
  const point = Math.round((rr.rankLow + rr.rankHigh) / 2);
  return classify(college, point).chance;
}
