import React, { useState } from "react";
import { ACME } from "../constants.js";

/**
 * ShareResult — generates a 1080×1080 square share card for WhatsApp / Instagram
 * using the native Canvas API (same reliable approach as the CUET score card,
 * NOT html2canvas). Presentation only.
 */
const ShareResult = ({ data, rankStr, eligibleCount = 0, topCollege }) => {
  const [busy, setBusy] = useState("");

  /* Build the square card on a canvas; resolves once the logo has loaded. */
  const buildCanvas = () =>
    new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");

      const fit = (text, max, start, min = 22) => {
        let s = start;
        ctx.font = `bold ${s}px Georgia, serif`;
        while (ctx.measureText(text).width > max && s > min) {
          s -= 3;
          ctx.font = `bold ${s}px Georgia, serif`;
        }
        return s;
      };

      const draw = (logoImg) => {
        // Background gradient
        const g = ctx.createLinearGradient(0, 0, 1080, 1080);
        g.addColorStop(0, "#1e3a8a");
        g.addColorStop(0.55, "#1d4ed8");
        g.addColorStop(1, "#4338ca");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 1080, 1080);

        // Dotted texture
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        for (let x = 60; x < 1080; x += 48)
          for (let y = 60; y < 1080; y += 48) {
            ctx.beginPath();
            ctx.arc(x, y, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }

        // Top accent bar
        const bar = ctx.createLinearGradient(0, 0, 1080, 0);
        bar.addColorStop(0, "#22d3ee");
        bar.addColorStop(1, "#a855f7");
        ctx.fillStyle = bar;
        ctx.fillRect(0, 0, 1080, 10);

        // Faint watermark
        ctx.save();
        ctx.globalAlpha = 0.06;
        ctx.font = "bold 360px Georgia, serif";
        ctx.fillStyle = "#ffffff";
        ctx.translate(540, 650);
        ctx.rotate(-0.22);
        ctx.textAlign = "center";
        ctx.fillText("ACME", 0, 0);
        ctx.restore();
        ctx.textAlign = "left";

        // Logo (white circle + clipped image)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(112, 120, 52, 0, Math.PI * 2);
        ctx.fill();
        if (logoImg) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(112, 120, 46, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, 66, 74, 92, 92);
          ctx.restore();
        }

        // Brand text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 46px Georgia, serif";
        ctx.fillText("ACME ACADEMY", 190, 112);
        ctx.fillStyle = "#bfdbfe";
        ctx.font = "500 23px Georgia, serif";
        ctx.fillText("India's Trusted NIMCET Guidance Platform", 192, 150);

        // Badge pill
        ctx.font = "bold 22px Georgia, serif";
        const badge = "NIMCET RANK PREDICTOR   ·   OFFICIAL REPORT";
        const bwid = ctx.measureText(badge).width + 48;
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.beginPath();
        ctx.roundRect(80, 212, bwid, 54, 27);
        ctx.fill();
        ctx.fillStyle = "#e0e7ff";
        ctx.fillText(badge, 104, 247);

        // Predicted rank
        ctx.textAlign = "center";
        ctx.fillStyle = "#bfdbfe";
        ctx.font = "600 30px Georgia, serif";
        ctx.fillText("PREDICTED ALL INDIA RANK (AIR)", 540, 400);
        ctx.fillStyle = "#ffffff";
        const rfont = fit(rankStr, 940, 168, 70);
        ctx.font = `bold ${rfont}px Georgia, serif`;
        ctx.fillText(rankStr, 540, 520);
        ctx.fillStyle = "#dbeafe";
        ctx.font = "500 26px Georgia, serif";
        ctx.fillText(`Category: ${data?.category || "—"}`, 540, 575);

        // Top eligible college box
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.roundRect(110, 636, 860, 176, 24);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(110, 636, 860, 176, 24);
        ctx.stroke();
        ctx.fillStyle = "#bfdbfe";
        ctx.font = "bold 24px Georgia, serif";
        ctx.fillText("TOP ELIGIBLE COLLEGE", 540, 696);
        ctx.fillStyle = "#ffffff";
        const cfont = fit(topCollege || "—", 800, 46, 24);
        ctx.font = `bold ${cfont}px Georgia, serif`;
        ctx.fillText(topCollege || "—", 540, 754);
        if (eligibleCount) {
          ctx.fillStyle = "#c7d2fe";
          ctx.font = "500 22px Georgia, serif";
          ctx.fillText(`Eligible for ${eligibleCount} colleges`, 540, 792);
        }

        // CTA + website
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 30px Georgia, serif";
        ctx.fillText("Predict your NIMCET rank — free", 540, 902);
        ctx.fillStyle = "#a5f3fc";
        ctx.font = "bold 32px Georgia, serif";
        ctx.fillText(`🔗 ${ACME.website}`, 540, 950);

        // Footer
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "500 20px Georgia, serif";
        ctx.fillText("Generated by ACME Academy NIMCET Rank Predictor", 540, 1012);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.font = "500 18px Georgia, serif";
        ctx.fillText(
          new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
          540,
          1044
        );
        ctx.textAlign = "left";

        resolve(canvas);
      };

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = "/logo.png"; // same-origin (public) — no canvas taint
      img.onload = () => draw(img);
      img.onerror = () => draw(null);
    });

  const run = async (action) => {
    setBusy(action);
    try {
      const canvas = await buildCanvas();
      const fileName = "ACME-NIMCET-Rank-Card.png";

      if (action === "download") {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        return;
      }

      const blob = await new Promise((r) => canvas.toBlob(r, "image/png", 1.0));
      const file = new File([blob], fileName, { type: "image/png" });
      const text = `My predicted NIMCET rank is ${rankStr} (AIR) — via ${ACME.productName}. Predict yours: ${ACME.website}`;

      // Native share sheet (mobile) — lets the user pick WhatsApp/Instagram directly
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          return;
        } catch {
          /* user cancelled — fall through to download */
        }
      }

      // Desktop fallback: download the image, and for WhatsApp also open the chat
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      if (action === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
    } catch (e) {
      console.error("Share card generation failed:", e);
      alert("Could not generate the card. Please try again.");
    } finally {
      setBusy("");
    }
  };

  const btn = (label, action, bg) => (
    <button
      onClick={() => run(action)}
      disabled={!!busy}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 20px", borderRadius: 12, border: "none",
        cursor: busy ? "wait" : "pointer", color: "#fff", fontSize: 14, fontWeight: 700,
        background: bg, boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        opacity: busy && busy !== action ? 0.6 : 1,
      }}
    >
      {busy === action ? "Generating…" : label}
    </button>
  );

  return (
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Share your result</h2>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b" }}>{ACME.trustLine}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {btn("📲  Share on WhatsApp", "whatsapp", "linear-gradient(90deg,#22c55e,#16a34a)")}
        {btn("📸  Instagram / Save Image", "instagram", "linear-gradient(90deg,#e1306c,#c13584)")}
        {btn("⬇️  Download Card", "download", "linear-gradient(90deg,#2563eb,#4f46e5)")}
      </div>
    </div>
  );
};

export default ShareResult;
