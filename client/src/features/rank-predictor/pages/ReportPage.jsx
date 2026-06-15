import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import marksToRank from "../data/marks_to_rank.json";
import collegeCutoffs from "../data/college_cutoffs.json";
import { generatePdf } from "../utils/generatePdf";
import { chanceFor } from "../utils/collegeTiers.js";
import { reportNumber } from "../utils/branding.js";
import { RP_BASE, ACME } from "../constants.js";
import logo from "../assets/logo.png";

import ReportHeader from "../components/ReportHeader.jsx";
import ResultHero from "../components/ResultHero.jsx";
import CollegeCard from "../components/CollegeCard.jsx";
import ShareResult from "../components/ShareResult.jsx";

import photo1 from "../assets/topper1.jpg";
import photo2 from "../assets/topper2.jpg";
import photo3 from "../assets/batch1.png";
import photo4 from "../assets/batch2.png";

// Course-promo images for the Advertisement Section (added from testing build).
import ad1 from "../assets/ad_course1.png";
import ad2 from "../assets/ad_course2.png";
import ad3 from "../assets/ad_course3.png";

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

  // Updated top/fallback computation (from testing build).
  // Sort the category's colleges by closing rank (high), then keep every college
  // the student's optimistic predicted rank (rankLow) can still reach.
  const catList          = [...(collegeCutoffs[data.category] || [])].sort((a, b) => a.high - b.high);
  const eligibleColleges = catList.filter((c) => rr && rr.rankLow <= c.high);
  const topC             = eligibleColleges.length > 0 ? eligibleColleges[0] : null;
  const fallbackC        = eligibleColleges.length > 1 ? eligibleColleges[1] : null;
  const colleges         = { top: topC?.college || "Not Eligible", fallback: fallbackC?.college || "None" };
  /* ───────────────────────────────────────────────────────────── */

  // PRESENTATION — derived from the SAME eligibleColleges list so the on-screen
  // cards stay consistent with the PDF. Top Eligible = most competitive reachable
  // college; Fallbacks = the next 1–2 safer eligible colleges.
  const topEligible = topC;
  const fallbacks = eligibleColleges.slice(1, 3);

  const topEligibleCard = topEligible ? { ...topEligible, tier: "Target", chance: chanceFor(topEligible, rr) } : null;
  const fallbackCards = fallbacks.map((c) => ({ ...c, tier: "Safe", chance: chanceFor(c, rr) }));

  // For the share card
  const eligibleCount = eligibleColleges.length;
  const previewColleges = [topEligible, ...fallbacks].filter(Boolean).slice(0, 3).map((c) => c.college);
  const topCollege = topEligible?.college || colleges.top;

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

        {/* 2. COLLEGE RECOMMENDATIONS — Top Eligible + Fallback */}
        <div style={card()}>
          <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            College Recommendations
          </h2>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
            Based on your predicted rank ({rankStr}) for the <strong style={{ color: "#0f172a" }}>{data.category}</strong> category
          </p>

          {/* Top Eligible College */}
          <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            Top Eligible College
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#64748b" }}>
            The best college matched to your predicted rank
          </p>
          {topEligibleCard ? (
            <div style={{ maxWidth: 360 }}>
              <CollegeCard college={topEligibleCard} category={data.category} badge="Top Eligible" />
            </div>
          ) : (
            <div style={emptyBox}>
              Your predicted rank is outside the listed {data.category} cutoffs. Aim higher with ACME's NIMCET courses.
            </div>
          )}

          {/* Fallback Option */}
          <h3 style={{ margin: "26px 0 2px", fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
            Fallback Option
          </h3>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#64748b" }}>
            Safer backups you can confidently target, with your admission chances
          </p>
          {fallbackCards.length ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,300px))", gap: 16 }}>
              {fallbackCards.map((c) => (
                <CollegeCard key={c.college} college={c} category={data.category} badge="Fallback" />
              ))}
            </div>
          ) : (
            <div style={emptyBox}>No safer fallback below your top college in this category.</div>
          )}
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

        {/* ── Advertisement Section (course promos) ── */}
        <div style={{
          ...card(),
          padding: 28,
          background: "linear-gradient(135deg, #ffffff, #f8fafc)",
          border: "1px solid rgba(59,130,246,0.2)",
          boxShadow: "0 10px 30px rgba(59,130,246,0.08)",
        }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ display: "inline-block", background: "#fee2e2", color: "#ef4444", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
              Level Up Your Prep
            </div>
            <h3 style={{ fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "800", color: "#0f172a", margin: "0 0 8px" }}>
              Didn't make it to your dream college this year?
            </h3>
            <p style={{ fontSize: "15px", color: "#64748b", margin: 0, maxWidth: "600px", marginInline: "auto" }}>
              Don't worry! You still have a chance to ace your exams with our premium courses designed specifically for NIMCET &amp; CUET 2027.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {/* Course 1 */}
            <a href="https://acmea.courses.store/615002" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex" }}>
              <div style={{ flex: 1, borderRadius: "16px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <img src={ad1} alt="Lakshya Dropper Batch" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderBottom: "1px solid #e2e8f0" }} />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#fee2e2", color: "#dc2626", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>Dropper Batch</span>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>Extra ₹2,000 Off</span>
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", lineHeight: 1.4 }}>
                    NIMCET 2027 Lakshya Dropper Batch | NIMCET-2027 &amp; CUET
                  </h4>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#64748b", textDecoration: "line-through", marginRight: "6px" }}>₹20,000</span>
                      <span style={{ fontSize: "22px", fontWeight: "900", color: "#059669" }}>₹18,000</span>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Course 2 */}
            <a href="https://acmea.courses.store/380094" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex" }}>
              <div style={{ flex: 1, borderRadius: "16px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <img src={ad2} alt="VOD Course" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderBottom: "1px solid #e2e8f0" }} />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#f3e8ff", color: "#7e22ce", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>VOD Course</span>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#fef08a", color: "#854d0e", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>Extra ₹500 Off</span>
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", lineHeight: 1.4 }}>
                    VOD COURSE | NIMCET 2027 | CUET 2027 (ASSC-ACME Self...)
                  </h4>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "12px", color: "#64748b", textDecoration: "line-through", marginRight: "6px" }}>₹7,000</span>
                      <span style={{ fontSize: "22px", fontWeight: "900", color: "#059669" }}>₹6,500</span>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Course 3 */}
            <a href="https://acmea.courses.store/290322" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex" }}>
              <div style={{ flex: 1, borderRadius: "16px", background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <img src={ad3} alt="Test Series" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderBottom: "1px solid #e2e8f0" }} />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#dbeafe", color: "#1d4ed8", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>Test Series</span>
                    <span style={{ fontSize: "10px", fontWeight: "800", background: "#e0e7ff", color: "#4338ca", padding: "4px 8px", borderRadius: "6px", textTransform: "uppercase" }}>Best Seller</span>
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", lineHeight: 1.4 }}>
                    ACME Premium Test Series<br /><span style={{ fontSize: "13px", fontWeight: "600", color: "#94a3b8" }}>Target: NIMCET, CUET &amp; MAH-CET</span>
                  </h4>
                  <div style={{ flex: 1 }}></div>
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: "22px", fontWeight: "900", color: "#059669" }}>₹4,633</span>
                    </div>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #e2e8f0" }}>
            <a href="https://acmea.courses.store" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "700", color: "#2563eb", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", transition: "background 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#eff6ff"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              Also for more courses visit acmea.courses.store
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
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

const emptyBox = {
  border: "1px dashed #cbd5e1",
  borderRadius: 14,
  padding: "18px",
  textAlign: "center",
  color: "#64748b",
  fontSize: 13,
  background: "#f8fafc",
};

export default ReportPage;
