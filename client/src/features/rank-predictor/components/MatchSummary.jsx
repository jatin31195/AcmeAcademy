import React from "react";

/**
 * MatchSummary — counts of Dream / Target / Safe colleges, derived from the
 * existing cutoff data (see utils/collegeTiers.js). Display only.
 */
const TIERS = [
  { key: "dream",  label: "Dream Colleges",  hint: "Ambitious reach options", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  { key: "target", label: "Target Colleges", hint: "Best-fit matches",        color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  { key: "safe",   label: "Safe Colleges",   hint: "High-confidence options", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
];

const MatchSummary = ({ counts }) => {
  const total = (counts.dream || 0) + (counts.target || 0) + (counts.safe || 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>College Match Summary</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
          You are eligible for <strong style={{ color: "#0f172a" }}>{total}</strong> colleges in your category
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="rp-summary-grid">
        <style>{`@media(max-width:560px){.rp-summary-grid{grid-template-columns:1fr!important;}}`}</style>
        {TIERS.map((t) => (
          <div
            key={t.key}
            style={{
              background: t.bg,
              border: `1px solid ${t.border}`,
              borderRadius: 16,
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: -20, right: -20, width: 70, height: 70, borderRadius: "50%", background: t.color, opacity: 0.08 }} />
            <p style={{ margin: 0, fontSize: 36, fontWeight: 900, color: t.color, lineHeight: 1 }}>{counts[t.key] || 0}</p>
            <p style={{ margin: "8px 0 2px", fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{t.label}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{t.hint}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSummary;
