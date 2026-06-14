import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import marksToRank from "../data/marks_to_rank.json";
import collegeCutoffs from "../data/college_cutoffs.json";
import { generatePdf } from "../utils/generatePdf";
import { getTieredColleges } from "../utils/collegeTiers.js";
import { reportNumber } from "../utils/branding.js";
import { RP_BASE, ACME } from "../constants.js";
import logo from "../assets/logo.png";

import ReportHeader from "../components/ReportHeader.jsx";
import ResultHero from "../components/ResultHero.jsx";
import MatchSummary from "../components/MatchSummary.jsx";
import CollegeTierSection from "../components/CollegeTierSection.jsx";
import ShareResult from "../components/ShareResult.jsx";

import photo1 from "../assets/image1.jpg";
import photo2 from "../assets/image2.jpg";
import photo3 from "../assets/image3.jpg";
import photo4 from "../assets/image4.jpg";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [pdfBusy, setPdfBusy] = useState(false);
  const data = location.state;

  const photos = [
    { id: 1, url: photo1, link: "https://acmea.courses.store/404876", alt: "ACME Toppers 1" },
    { id: 2, url: photo2, link: "https://acmea.courses.store/404876", alt: "ACME Toppers 2" },
    { id: 3, url: photo3, link: "https://acmea.on-app.in/app/home", alt: "ACME Toppers 3" },
    { id: 4, url: photo4, link: "https://acmea.on-app.in/app/home", alt: "ACME Toppers 4" },
  ];

  useEffect(() => {
    if (!data) navigate(RP_BASE);
    const t = setInterval(() => setSlide((p) => (p + 1) % photos.length), 3000);
    return () => clearInterval(t);
  }, [data, navigate, photos.length]);

  if (!data) return null;

  /* ─────────────────────────────────────────────────────────────
     PREDICTION LOGIC — UNCHANGED (do not modify)
     ───────────────────────────────────────────────────────────── */
  const rankRecord = marksToRank.find((r) => data.marks >= r.min_marks && data.marks <= r.max_marks);
  const rr = rankRecord ? { rankLow: rankRecord.rank_low, rankHigh: rankRecord.rank_high } : null;
  const rankStr = rr ? `${rr.rankLow} – ${rr.rankHigh}` : "N/A";

  // Existing top/fallback computation — kept intact for the PDF.
  const catList = [...(collegeCutoffs[data.category] || [])].sort((a, b) => a.low - b.low);
  const topC = catList.find((c) => rr && c.low <= rr.rankLow && rr.rankLow <= c.high);
  const fallbackC = catList.find((c) => rr && rr.rankLow < c.low);
  const colleges = { top: topC?.college || "Not Eligible", fallback: fallbackC?.college || "None" };
  /* ───────────────────────────────────────────────────────────── */

  // PRESENTATION-ONLY: regroup existing cutoff bands into tiers.
  const { dream, target, safe } = getTieredColleges(data.category, rr);
  const counts = { dream: dream.length, target: target.length, safe: safe.length };
  const eligibleCount = counts.dream + counts.target + counts.safe;
  const previewColleges = [...safe, ...target, ...dream].slice(0, 3).map((c) => c.college);
  const topCollege = (safe[0] || target[0] || dream[0])?.college || colleges.top;

  const handleDownloadPDF = async () => {
    setPdfBusy(true);
    try {
      await generatePdf({ data, rr, colleges, logoSrc: logo, reportNo: reportNumber(data) });
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("PDF generation failed. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  const sectionGap = { display: "flex", flexDirection: "column", gap: 22 };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#f1f5f9", padding: "20px 16px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", ...sectionGap }}>

        {/* Report header strip */}
        <ReportHeader data={data} />

        {/* 1. HERO */}
        <ResultHero data={data} rr={rr} rankStr={rankStr} onDownloadPdf={handleDownloadPDF} pdfBusy={pdfBusy} />

        {/* 2. MATCH SUMMARY */}
        <div style={card()}>
          <MatchSummary counts={counts} />
        </div>

        {/* 3. DREAM */}
        <div style={card()}>
          <CollegeTierSection tier="Dream" colleges={dream} category={data.category} />
        </div>

        {/* 4. TARGET */}
        <div style={card()}>
          <CollegeTierSection tier="Target" colleges={target} category={data.category} />
        </div>

        {/* 5. SAFE */}
        <div style={card()}>
          <CollegeTierSection tier="Safe" colleges={safe} category={data.category} />
        </div>

        {/* 6. PROFILE (+ existing achievers carousel) */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Applicant Profile</h2>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 18 }} className="rp-profile-grid">
            <style>{`@media(max-width:680px){.rp-profile-grid{grid-template-columns:1fr!important;}}`}</style>

            <div>
              {[
                ["Full Name", data.name],
                ["Registration No.", data.regNo],
                ["Category", data.category],
                ["Location", `${data.city}, ${data.state}`],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 600, color: "#0f172a", wordBreak: "break-word" }}>{val}</p>
                </div>
              ))}
              <p style={{ margin: "10px 0 0", fontSize: 11.5, color: "#94a3b8" }}>{ACME.methodologyLine} · {ACME.poweredBy}</p>
            </div>

            {/* Existing achievers carousel — preserved */}
            <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #e2e8f0", background: "#0f172a" }}>
              <div style={{ padding: "9px 14px", background: "#1e293b", borderBottom: "1px solid #334155", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ACME Top Achievers
                </p>
              </div>
              <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                <div style={{ display: "flex", height: "100%", transform: `translateX(-${slide * 100}%)`, transition: "transform 0.6s ease" }}>
                  {photos.map((p) => (
                    <div key={p.id} style={{ width: "100%", height: "100%", flexShrink: 0 }}>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", width: "100%", height: "100%" }}>
                        <img src={p.url} alt={p.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </a>
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
                  {photos.map((_, i) => (
                    <div key={i} onClick={() => setSlide(i)} style={{ cursor: "pointer", height: 5, borderRadius: 3, transition: "width 0.3s, background 0.3s", width: i === slide ? 18 : 5, background: i === slide ? "#fff" : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. SHARE */}
        <div style={card()}>
          <ShareResult
            data={data}
            rr={rr}
            rankStr={rankStr}
            eligibleCount={eligibleCount}
            previewColleges={previewColleges}
            topCollege={topCollege}
          />
        </div>

        {/* Footer branding */}
        <div style={{ textAlign: "center", padding: "8px 0 0" }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "#64748b" }}>
            {ACME.reportTitle} · {ACME.poweredBy}
          </p>
          <a href={ACME.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "#1d4ed8", fontWeight: 700, textDecoration: "none" }}>
            {ACME.website}
          </a>
        </div>
      </div>
    </div>
  );
};

/* shared card shell */
function card() {
  return {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 22,
    boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
  };
}

export default ReportPage;
