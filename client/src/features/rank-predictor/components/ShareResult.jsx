import React, { useRef, useState } from "react";
import logo from "../assets/logo.png";
import { ACME } from "../constants.js";

/* ── QR placeholder (no QR library needed) ── */
const QrPlaceholder = ({ size = 120, label = "Scan to predict yours" }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
    <div
      style={{
        width: size, height: size, borderRadius: 14, background: "#fff",
        border: "3px solid #1e3a8a", display: "grid",
        gridTemplateColumns: "repeat(5,1fr)", gridTemplateRows: "repeat(5,1fr)",
        padding: 8, gap: 3,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{ background: (i * 7) % 3 === 0 ? "#1e3a8a" : "transparent", borderRadius: 2 }} />
      ))}
    </div>
    <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{label}</span>
  </div>
);

/* ── Capture + share helpers ── */
async function capture(node) {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(node, { scale: 1, useCORS: true, backgroundColor: "#ffffff", logging: false });
  return await new Promise((res) => canvas.toBlob((b) => res(b), "image/png", 0.95));
}

async function shareOrDownload(blob, filename, text) {
  if (!blob) return;
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return true;
    } catch { /* user cancelled or unsupported — fall through to download */ }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return false;
}

/**
 * ShareResult — WhatsApp & Instagram share cards generated from hidden,
 * inline-styled (html2canvas-safe) templates. Presentation only.
 */
const ShareResult = ({ data, rr, rankStr, eligibleCount = 0, previewColleges = [], topCollege }) => {
  const waRef = useRef(null);
  const igRef = useRef(null);
  const [busy, setBusy] = useState("");

  const shareWhatsApp = async () => {
    setBusy("wa");
    try {
      const blob = await capture(waRef.current);
      const text = `My predicted NIMCET rank is ${rankStr} (AIR) — generated on ${ACME.productName}. Predict yours: ${ACME.website}`;
      const shared = await shareOrDownload(blob, "ACME-NIMCET-Result.png", text);
      if (!shared) window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    } catch { alert("Could not generate the share image. Please try again."); }
    finally { setBusy(""); }
  };

  const shareInstagram = async () => {
    setBusy("ig");
    try {
      const blob = await capture(igRef.current);
      await shareOrDownload(blob, "ACME-NIMCET-Story.png", `Predict your NIMCET rank — ${ACME.website}`);
    } catch { alert("Could not generate the story image. Please try again."); }
    finally { setBusy(""); }
  };

  const btn = (label, onClick, isBusy, bg) => (
    <button
      onClick={onClick}
      disabled={!!busy}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 20px", borderRadius: 12, border: "none",
        cursor: busy ? "wait" : "pointer", color: "#fff", fontSize: 14, fontWeight: 700,
        background: bg, boxShadow: "0 4px 14px rgba(0,0,0,0.15)", opacity: busy && !isBusy ? 0.6 : 1,
      }}
    >
      {isBusy ? "Generating…" : label}
    </button>
  );

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Share your result</h2>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b" }}>{ACME.trustLine}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {btn("📲  Share on WhatsApp", shareWhatsApp, busy === "wa", "linear-gradient(90deg,#22c55e,#16a34a)")}
        {btn("📸  Instagram Story", shareInstagram, busy === "ig", "linear-gradient(90deg,#e1306c,#c13584)")}
        <a
          href={ACME.website}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 20px", borderRadius: 12, border: "1px solid #cbd5e1", color: "#1d4ed8", fontSize: 14, fontWeight: 700, textDecoration: "none", background: "#fff" }}
        >
          🌐  {ACME.websiteLabel}
        </a>
      </div>

      {/* ═══════ Hidden capture templates (rendered off-screen) ═══════ */}

      {/* WhatsApp square 1080×1080 */}
      <div ref={waRef} style={{ position: "fixed", left: -99999, top: 0, width: 1080, height: 1080, background: "linear-gradient(160deg,#1e3a8a 0%,#1d4ed8 55%,#4338ca 100%)", color: "#fff", boxSizing: "border-box", padding: 70, fontFamily: "Arial, Helvetica, sans-serif", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 24, padding: 16 }}>
            <img src={logo} alt="ACME" style={{ height: 84, width: 84, objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.1 }}>{ACME.name}</div>
            <div style={{ fontSize: 20, color: "#dbeafe" }}>{ACME.tagline}</div>
          </div>
        </div>

        <div style={{ marginTop: 60 }}>
          <div style={{ fontSize: 26, color: "#bfdbfe", fontWeight: 700, letterSpacing: 1 }}>MY PREDICTED NIMCET RANK</div>
          <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1, marginTop: 8 }}>{rankStr}</div>
          <div style={{ fontSize: 26, color: "#dbeafe", marginTop: 6 }}>Expected All India Rank · {data?.category}</div>
        </div>

        <div style={{ marginTop: 44, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 22, padding: "26px 32px" }}>
          <div style={{ fontSize: 22, color: "#bfdbfe", fontWeight: 700, marginBottom: 10 }}>
            ELIGIBLE FOR {eligibleCount} COLLEGES
          </div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>
            {(previewColleges.length ? previewColleges : ["Top NITs & IIITs"]).slice(0, 3).join("  ·  ")}
          </div>
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, color: "#dbeafe" }}>Generated using</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{ACME.productName}</div>
            <div style={{ fontSize: 26, fontWeight: 800, marginTop: 8 }}>🌐 {ACME.website}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 18, padding: 18 }}>
            <QrPlaceholder size={150} label="" />
          </div>
        </div>
      </div>

      {/* Instagram story 1080×1920 */}
      <div ref={igRef} style={{ position: "fixed", left: -99999, top: 0, width: 1080, height: 1920, background: "linear-gradient(180deg,#1e3a8a 0%,#4338ca 60%,#7c3aed 100%)", color: "#fff", boxSizing: "border-box", padding: 80, fontFamily: "Arial, Helvetica, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ height: 220 }} /> {/* top space for stickers */}
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 32, padding: 22 }}>
          <img src={logo} alt="ACME" style={{ height: 120, width: 120, objectFit: "contain" }} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, marginTop: 24 }}>{ACME.name}</div>
        <div style={{ fontSize: 26, color: "#dbeafe", marginTop: 6 }}>{ACME.tagline}</div>

        <div style={{ marginTop: 90, fontSize: 30, color: "#bfdbfe", fontWeight: 700, letterSpacing: 1 }}>PREDICTED NIMCET RANK</div>
        <div style={{ fontSize: 200, fontWeight: 900, lineHeight: 1, marginTop: 10 }}>{rankStr}</div>

        {topCollege && (
          <div style={{ marginTop: 50, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 26, padding: "30px 44px" }}>
            <div style={{ fontSize: 26, color: "#bfdbfe", fontWeight: 700 }}>TOP PREDICTED COLLEGE</div>
            <div style={{ fontSize: 48, fontWeight: 900, marginTop: 8 }}>{topCollege}</div>
          </div>
        )}

        <div style={{ marginTop: 80, background: "#fff", color: "#1d4ed8", borderRadius: 999, padding: "26px 60px", fontSize: 40, fontWeight: 900 }}>
          Predict Your Rank →
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <QrPlaceholder size={170} label="" />
          <div style={{ fontSize: 34, fontWeight: 800 }}>🌐 {ACME.website}</div>
        </div>
      </div>
    </div>
  );
};

export default ShareResult;
