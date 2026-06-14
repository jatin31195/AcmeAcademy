import React, { useEffect } from "react";
import logo from "../assets/logo.png";
import { ACME } from "../constants.js";
import { useCountUp } from "../hooks/useCountUp.js";

/**
 * ResultHero — the emotional payoff.
 * Animated count-up of the predicted rank, celebration banner + confetti,
 * and prominent (but professional) ACME branding. No prediction logic here —
 * it only DISPLAYS the `rr` / `rankStr` produced by the existing engine.
 */
const ResultHero = ({ data, rr, rankStr, onDownloadPdf, pdfBusy }) => {
  const countLow = useCountUp(rr ? rr.rankLow : null);

  // One-time celebration confetti (js-confetti is already a project dependency).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { default: JSConfetti } = await import("js-confetti");
        if (cancelled) return;
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti({
          confettiColors: ["#2563eb", "#4f46e5", "#7c3aed", "#06b6d4", "#22c55e"],
          confettiNumber: 160,
        });
      } catch { /* confetti is non-critical */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 55%,#4338ca 100%)",
        color: "#fff",
        boxShadow: "0 20px 50px rgba(37,99,235,0.30)",
      }}
    >
      {/* Celebration banner */}
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          borderBottom: "1px solid rgba(255,255,255,0.18)",
          padding: "10px 20px",
          textAlign: "center",
          fontSize: 13.5,
          fontWeight: 600,
          letterSpacing: "0.01em",
        }}
      >
        🎉 Congratulations{data?.name ? `, ${data.name.split(" ")[0]}` : ""}! Your NIMCET prediction report is ready.
      </div>

      <div style={{ padding: "28px 28px 30px" }}>
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 18, padding: 10, backdropFilter: "blur(6px)" }}>
            <img src={logo} alt="ACME Academy" style={{ height: 54, width: 54, objectFit: "contain" }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "clamp(18px,3.4vw,24px)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.4px" }}>
              {ACME.productName}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "rgba(219,234,254,0.92)" }}>
              {ACME.tagline}
            </p>
          </div>
          <span
            style={{
              marginLeft: "auto",
              alignSelf: "flex-start",
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 11.5,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            Official Prediction Report
          </span>
        </div>

        {/* Result grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 16,
          }}
          className="rp-hero-grid"
        >
          <style>{`@media(max-width:560px){.rp-hero-grid{grid-template-columns:1fr!important;}}`}</style>

          {/* Marks */}
          <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 16, padding: "18px 20px" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#bfdbfe", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Your NIMCET Marks
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, lineHeight: 1 }}>{data?.marks}</span>
              <span style={{ fontSize: 14, color: "#bfdbfe" }}>/ 1000</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#dbeafe" }}>
              Category: <strong>{data?.category}</strong>
            </p>
          </div>

          {/* Predicted AIR */}
          <div style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 16, padding: "18px 20px", position: "relative" }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#e0e7ff", textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Predicted All India Rank
            </p>
            <div style={{ marginTop: 6, fontSize: "clamp(30px,6vw,46px)", fontWeight: 900, lineHeight: 1.05 }}>
              {rr ? (
                <>
                  {countLow}
                  <span style={{ opacity: 0.85 }}> – {rr.rankHigh}</span>
                </>
              ) : (
                "N/A"
              )}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#e0e7ff" }}>
              Expected AIR range · {ACME.methodologyLine}
            </p>
          </div>
        </div>

        {/* Footer row: trust + actions + website */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginTop: 22 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#dbeafe", fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {ACME.trustLine}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href={ACME.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.5)" }}
            >
              {ACME.websiteLabel}
            </a>
            <button
              onClick={onDownloadPdf}
              disabled={pdfBusy}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 20px", borderRadius: 12, border: "none",
                cursor: pdfBusy ? "wait" : "pointer",
                background: "#ffffff", color: "#1d4ed8", fontWeight: 800, fontSize: 13.5,
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              }}
            >
              {pdfBusy ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(29,78,216,0.25)" strokeWidth="4" />
                  <path d="M12 2a10 10 0 0110 10" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1d4ed8" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {pdfBusy ? "Generating PDF…" : "Download PDF Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultHero;
