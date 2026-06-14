import React, { useState } from "react";
import { getCollegeMeta } from "../collegeMeta.js";
import { ACME } from "../constants.js";

const TIER_STYLE = {
  Dream:  { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", grad: "linear-gradient(135deg,#7c3aed,#4338ca)", label: "Dream" },
  Target: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", grad: "linear-gradient(135deg,#2563eb,#06b6d4)", label: "Target" },
  Safe:   { color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", grad: "linear-gradient(135deg,#059669,#10b981)", label: "Safe" },
  Reach:  { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", grad: "linear-gradient(135deg,#64748b,#94a3b8)", label: "Reach" },
};

function initials(name = "") {
  return (
    name.replace(/[^A-Za-z ]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "C"
  );
}

/**
 * CollegeCard — premium, responsive card. Presentation only.
 * `college` carries the cutoff fields (college, low, high) + derived { tier, chance }.
 * Metadata (image/logo/location/seats/fees/packages/website) comes from collegeMeta.js.
 *
 * Display order: Image → Logo → Name → Tier badge → Chance badge → Location →
 * Seats → Fees → Avg Package → View Details.
 */
const CollegeCard = ({ college, category }) => {
  const meta = getCollegeMeta(college.college);
  const ts = TIER_STYLE[college.tier] || TIER_STYLE.Reach;
  const name = meta.name || college.college;
  const init = initials(name);

  const [hover, setHover] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const showImage = meta.image && !imgError;
  const showSkeleton = showImage && !imgLoaded;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#ffffff",
        border: `1px solid ${hover ? ts.border : "#e8edf3"}`,
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover ? "0 18px 40px rgba(15,23,42,0.16)" : "0 2px 14px rgba(15,23,42,0.06)",
      }}
    >
      {/* Local keyframes for the loading shimmer */}
      <style>{`@keyframes rpShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}`}</style>

      {/* 1. CAMPUS IMAGE */}
      <div style={{ position: "relative", height: 150, background: ts.grad, overflow: "hidden" }}>
        {showImage && (
          <img
            src={meta.image}
            alt={`${name} campus`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.4s ease, opacity 0.4s ease",
              transform: hover ? "scale(1.06)" : "scale(1)",
              opacity: imgLoaded ? 1 : 0,
            }}
          />
        )}

        {/* Loading skeleton */}
        {showSkeleton && (
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 37%,#e2e8f0 63%)",
              backgroundSize: "800px 100%",
              animation: "rpShimmer 1.3s linear infinite",
            }}
          />
        )}

        {/* Graceful fallback (no image / failed) */}
        {!showImage && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.92)", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.04em" }}>{meta.shortName || init}</span>
            <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.85, letterSpacing: "0.08em" }}>CAMPUS PHOTO</span>
          </div>
        )}

        {/* dark gradient for badge legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.28),transparent 45%,transparent 75%,rgba(0,0,0,0.15))" }} />

        {/* 4. TIER BADGE (top-left) */}
        <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.95)", color: ts.color, border: `1px solid ${ts.border}`, borderRadius: 999, padding: "4px 11px", fontSize: 11.5, fontWeight: 800, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
          {ts.label}
        </span>

        {/* 5. CHANCE BADGE (top-right) */}
        <span style={{ position: "absolute", top: 10, right: 10, background: ts.color, color: "#fff", borderRadius: 999, padding: "4px 11px", fontSize: 11.5, fontWeight: 800, boxShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
          {college.chance}% chance
        </span>

        {/* 2. COLLEGE LOGO (overlapping bottom-left) */}
        <div style={{ position: "absolute", left: 14, bottom: -20, height: 46, width: 46, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.14)", overflow: "hidden" }}>
          {meta.logo && !logoError ? (
            <img src={meta.logo} alt={`${name} logo`} onError={() => setLogoError(true)} style={{ height: "100%", width: "100%", objectFit: "contain", padding: 4 }} />
          ) : (
            <span style={{ fontSize: 14, fontWeight: 900, color: ts.color }}>{init}</span>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={{ padding: "26px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* 3. COLLEGE NAME */}
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>{name}</h3>
        {meta.shortName && meta.shortName !== name && (
          <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 600 }}>{meta.shortName}</span>
        )}

        {/* 6. LOCATION */}
        {meta.location && (
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <circle cx="12" cy="11" r="2.5" />
            </svg>
            {meta.location}
          </p>
        )}

        {/* confidence bar */}
        <div style={{ marginTop: 12, height: 7, borderRadius: 999, background: ts.bg, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${college.chance}%`, background: ts.grad, borderRadius: 999, transition: "width 0.5s ease" }} />
        </div>

        {/* 7/8/9. SEATS · FEES · AVG PACKAGE */}
        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <Stat label="Seats" value={meta.seats} ts={ts} />
          <Stat label="Fees" value={meta.fees} ts={ts} />
          <Stat label="Avg Pkg" value={meta.avgPackage} ts={ts} />
        </div>

        {/* category + closing-rank chip */}
        <div style={{ marginTop: 12 }}>
          <span style={{ background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`, borderRadius: 8, padding: "5px 9px", fontSize: 11, fontWeight: 700 }}>
            {category} cutoff ≤ {college.high}
          </span>
        </div>

        {/* 10. VIEW DETAILS */}
        <div style={{ marginTop: "auto", paddingTop: 14 }}>
          {meta.officialWebsite ? (
            <a
              href={meta.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 11,
                background: ts.grad, color: "#fff", fontSize: 13.5, fontWeight: 800,
                textDecoration: "none", boxShadow: hover ? "0 8px 18px rgba(37,99,235,0.28)" : "none",
                transition: "box-shadow 0.25s ease",
              }}
            >
              View Details
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7M21 12H3" />
              </svg>
            </a>
          ) : (
            <div style={{ textAlign: "center", padding: "11px 14px", borderRadius: 11, background: "#f1f5f9", color: "#94a3b8", fontSize: 13, fontWeight: 700 }}>
              Details coming soon
            </div>
          )}
          <p style={{ margin: "10px 0 0", fontSize: 10, color: "#94a3b8", letterSpacing: "0.04em", textAlign: "center" }}>{ACME.poweredBy}</p>
        </div>
      </div>
    </div>
  );
};

/* Small stat block — hides cleanly when the value is empty (fallback colleges). */
function Stat({ label, value, ts }) {
  return (
    <div style={{ background: "#f8fafc", border: "1px solid #eef2f7", borderRadius: 10, padding: "8px 6px", textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: value ? "#0f172a" : "#cbd5e1", lineHeight: 1.2 }}>
        {value || "—"}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: 9.5, color: ts.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </p>
    </div>
  );
}

export default CollegeCard;
