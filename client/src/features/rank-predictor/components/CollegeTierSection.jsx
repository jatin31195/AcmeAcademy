import React from "react";
import CollegeCard from "./CollegeCard.jsx";

const TIER_META = {
  Dream:  { title: "Dream Colleges",  subtitle: "Ambitious picks — worth attempting in counselling", color: "#7c3aed", emoji: "🌟" },
  Target: { title: "Target Colleges", subtitle: "Best-fit colleges matched to your predicted rank",   color: "#2563eb", emoji: "🎯" },
  Safe:   { title: "Safe Colleges",   subtitle: "High-confidence options you can rely on",            color: "#059669", emoji: "🛡️" },
};

/**
 * CollegeTierSection — header + responsive grid of CollegeCard for one tier.
 * Renders a friendly empty state when a tier has no colleges.
 */
const CollegeTierSection = ({ tier, colleges = [], category }) => {
  const m = TIER_META[tier] || TIER_META.Target;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{m.emoji}</span>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{m.title}</h2>
        <span style={{ background: "#f1f5f9", color: m.color, borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 800 }}>
          {colleges.length}
        </span>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b" }}>{m.subtitle}</p>

      {colleges.length === 0 ? (
        <div style={{ border: "1px dashed #cbd5e1", borderRadius: 14, padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          No {m.title.toLowerCase()} for this rank in your category.
        </div>
      ) : (
        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 16 }}
        >
          {colleges.map((c) => (
            <CollegeCard key={c.college} college={c} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollegeTierSection;
