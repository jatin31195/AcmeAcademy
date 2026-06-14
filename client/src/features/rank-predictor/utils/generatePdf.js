/**
 * generatePdf.js — jsPDF programmatic PDF, no html2canvas
 * Colors: hex strings only (jsPDF accepts them directly)
 *
 * Presentation/branding only — the prediction values (rr, colleges) are passed
 * in from the caller and are NOT recomputed here.
 */
import { jsPDF } from "jspdf";
import { ACME } from "../constants.js";

/* ── Load image as base64 data URL ─────────────────── */
async function toDataURL(url) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return await new Promise((res) => {
      const reader = new FileReader();
      reader.onloadend = () => res(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

/* ── Main ───────────────────────────────────────────── */
export async function generatePdf({ data, rr, colleges, logoSrc, reportNo }) {
  const doc     = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const PW      = 612;  // page width  (letter = 8.5in @ 72pt)
  const PH      = 792;  // page height (letter = 11in @ 72pt)
  const margin  = 40;
  const inner   = PW - margin * 2;
  let   y       = 0;

  const rankStr = rr ? `${rr.rankLow} - ${rr.rankHigh}` : "Not Available";
  const date    = new Date().toLocaleDateString("en-GB",
    { day:"2-digit", month:"short", year:"numeric" });

  /* Load logo */
  const logoDataUrl = await toDataURL(logoSrc);

  /* ─── Helper shortcuts ─────────────────────────── */
  const fill  = (hex)         => doc.setFillColor(hex);
  const stroke= (hex)         => doc.setDrawColor(hex);
  const txt   = (hex)         => doc.setTextColor(hex);
  const font  = (style, size) => { doc.setFont("helvetica", style); doc.setFontSize(size); };
  const text  = (str, x, fy, opts) => doc.text(String(str), x, fy, opts || {});

  /* ═══════════════════════════════════════════════════
     1. TOP GRADIENT BAR
  ═══════════════════════════════════════════════════ */
  fill("#2563eb"); doc.rect(0, 0, PW/2, 7, "F");
  fill("#4338ca"); doc.rect(PW/2, 0, PW/2, 7, "F");
  y = 7;

  /* ── Diagonal watermark (drawn first so content overlays it) ── */
  font("bold", 64);
  txt("#eef2f8"); // very light — faint, non-intrusive
  text("ACME ACADEMY", PW / 2, 470, { align: "center", angle: 38 });

  /* ═══════════════════════════════════════════════════
     2. HEADER
  ═══════════════════════════════════════════════════ */
  y += 24;

  // Logo
  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, "PNG", margin, y, 52, 52); } catch {}
  }

  // Academy text
  font("bold", 17);
  txt("#1e3a8a");
  text("ACME Academy", margin + 62, y + 18);

  font("normal", 8.5);
  txt("#64748b");
  text("Official NIMCET Prediction Report", margin + 62, y + 32);
  font("normal", 7.5);
  txt("#94a3b8");
  text(ACME.methodologyLine, margin + 62, y + 44);

  // Date / report no. right-aligned
  font("bold", 9);
  txt("#64748b");
  text("Date:", PW - margin, y + 16, { align: "right" });
  font("bold", 10);
  txt("#0f172a");
  text(date, PW - margin, y + 28, { align: "right" });
  font("normal", 7.5);
  txt("#94a3b8");
  text("Ref: " + data.regNo, PW - margin, y + 40, { align: "right" });
  if (reportNo) text("Report: " + reportNo, PW - margin, y + 50, { align: "right" });

  y += 62;

  // Header divider
  stroke("#2563eb"); doc.setLineWidth(2);
  doc.line(margin, y, PW - margin, y);
  y += 18;

  /* ═══════════════════════════════════════════════════
     3. STUDENT PROFILE
  ═══════════════════════════════════════════════════ */
  font("bold", 8.5);
  txt("#64748b");
  text("STUDENT PROFILE", margin, y);
  y += 5;
  stroke("#e2e8f0"); doc.setLineWidth(0.5);
  doc.line(margin, y, PW - margin, y);
  y += 10;

  // Profile card bg
  fill("#f8fafc"); stroke("#e2e8f0"); doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, inner, 74, 6, 6, "FD");

  const profileItems = [
    ["FULL NAME",         data.name],
    ["REGISTRATION NO.",  data.regNo],
    ["CATEGORY",          data.category],
    ["LOCATION",          `${data.city}, ${data.state}`],
  ];
  const colW = inner / 2;
  profileItems.forEach(([label, value], i) => {
    const cx = margin + (i % 2) * colW + 14;
    const cy = y + 14 + Math.floor(i / 2) * 34;
    font("normal", 7.5); txt("#94a3b8"); text(label, cx, cy);
    font("bold", 12);    txt("#0f172a"); text(value, cx, cy + 14);
  });
  y += 86;

  /* ═══════════════════════════════════════════════════
     4. PREDICTION RESULTS
  ═══════════════════════════════════════════════════ */
  y += 4;
  font("bold", 8.5); txt("#64748b");
  text("AI PREDICTION RESULTS", margin, y);
  y += 5;
  stroke("#e2e8f0"); doc.setLineWidth(0.5);
  doc.line(margin, y, PW - margin, y);
  y += 10;

  const bw  = (inner - 12) / 2;
  const bh  = 86;

  // Marks box (blue)
  fill("#2563eb"); doc.roundedRect(margin, y, bw, bh, 8, 8, "F");
  font("bold", 8);    txt("#bfdbfe");
  text("NIMCET MARKS", margin + bw/2, y + 20, { align:"center" });
  font("bold", 38);   txt("#ffffff");
  text(String(data.marks), margin + bw/2, y + 58, { align:"center" });
  font("normal", 7.5); txt("#bfdbfe");
  text("Out of 1000", margin + bw/2, y + 74, { align:"center" });

  // Rank box (indigo)
  const rx2 = margin + bw + 12;
  fill("#4338ca"); doc.roundedRect(rx2, y, bw, bh, 8, 8, "F");
  font("bold", 8);    txt("#c7d2fe");
  text("PREDICTED ALL INDIA RANK", rx2 + bw/2, y + 20, { align:"center" });
  font("bold", rr ? 26 : 20); txt("#ffffff");
  text(rankStr, rx2 + bw/2, y + 54, { align:"center" });
  font("normal", 7.5); txt("#c7d2fe");
  text("Expected Rank Range", rx2 + bw/2, y + 74, { align:"center" });

  y += bh + 18;

  /* ═══════════════════════════════════════════════════
     5. COLLEGE RECOMMENDATIONS
  ═══════════════════════════════════════════════════ */
  font("bold", 8.5); txt("#64748b");
  text("COLLEGE RECOMMENDATIONS", margin, y);
  y += 5;
  stroke("#e2e8f0"); doc.setLineWidth(0.5);
  doc.line(margin, y, PW - margin, y);
  y += 10;

  // Top college — green
  fill("#ecfdf5"); stroke("#a7f3d0"); doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, inner, 60, 6, 6, "FD");
  fill("#059669"); doc.circle(margin + 24, y + 30, 13, "F");
  font("bold", 13); txt("#ffffff");
  text("*", margin + 24, y + 35, { align:"center" });   // checkmark substitute
  font("bold", 8);  txt("#059669");
  text("TOP ELIGIBLE COLLEGE", margin + 46, y + 18);
  font("bold", 15); txt("#064e3b");
  text(colleges.top, margin + 46, y + 42);
  y += 72;

  // Fallback — grey
  if (colleges.fallback && colleges.fallback !== "None" && colleges.fallback !== "Not Available") {
    fill("#f8fafc"); stroke("#e2e8f0"); doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, inner, 52, 6, 6, "FD");
    fill("#94a3b8"); doc.circle(margin + 24, y + 26, 11, "F");
    font("bold", 11); txt("#ffffff");
    text("i", margin + 24, y + 30, { align:"center" });
    font("bold", 8);  txt("#94a3b8");
    text("FALLBACK OPTION", margin + 46, y + 14);
    font("bold", 13); txt("#1e293b");
    text(colleges.fallback, margin + 46, y + 36);
    y += 64;
  }

  y += 8;


  /* ═══════════════════════════════════════════════════
     7. FOOTER (anchored to page bottom) — branding, QR, contact
  ═══════════════════════════════════════════════════ */
  const footerY = PH - 96;
  stroke("#e2e8f0"); doc.setLineWidth(0.5);
  doc.line(margin, footerY, PW - margin, footerY);

  // QR placeholder (left) — linking to the report/site
  const qrSize = 52;
  const qrX = margin;
  const qrY = footerY + 12;
  stroke("#1e3a8a"); doc.setLineWidth(1);
  doc.roundedRect(qrX, qrY, qrSize, qrSize, 5, 5, "S");
  fill("#1e3a8a");
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (((i * 5 + j) * 7) % 3 === 0) doc.rect(qrX + 7 + i * 7.6, qrY + 7 + j * 7.6, 5.5, 5.5, "F");
    }
  }
  font("normal", 6.5); txt("#94a3b8");
  text("Scan to view report", qrX + qrSize / 2, qrY + qrSize + 9, { align: "center" });

  // Branding + contact (right of QR)
  const tx = qrX + qrSize + 20;
  font("bold", 9.5); txt("#1e3a8a");
  text(ACME.reportTitle, tx, footerY + 22);
  font("normal", 8); txt("#64748b");
  text(`Generated by ${ACME.productName}`, tx, footerY + 35);
  text(`Website: ${ACME.website}    |    ${ACME.contactEmail}    |    ${ACME.contactPhone}`, tx, footerY + 48);
  font("normal", 7); txt("#94a3b8");
  text(`(c) ${new Date().getFullYear()} ${ACME.name}.  ${ACME.poweredBy}.  ${ACME.trustLine}.`, tx, footerY + 60);

  /* ── Save ── */
  doc.save(`${data.name}_NIMCET_Report.pdf`);
}
