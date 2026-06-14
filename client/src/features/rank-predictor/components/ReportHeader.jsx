import React from "react";
import logo from "../assets/logo.png";
import { ACME } from "../constants.js";
import { reportNumber, reportTimestamp } from "../utils/branding.js";

/**
 * Slim branded meta strip at the very top of the report:
 * ACME logo · report title · report number · timestamp · verified badge.
 */
const ReportHeader = ({ data }) => {
  const reportNo = reportNumber(data);
  const ts = reportTimestamp();

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ background: "#f1f5f9", borderRadius: "12px", padding: "7px", border: "1px solid #e2e8f0" }}>
          <img src={logo} alt="ACME Academy" style={{ height: 36, width: 36, objectFit: "contain" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>
            {ACME.reportTitle}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#64748b" }}>
            {ACME.methodologyLine}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Report No.
          </p>
          <p style={{ margin: "1px 0 0", fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}>
            {reportNo}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "#94a3b8" }}>Generated: {ts}</p>
        </div>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0",
            borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verified Student
        </span>
      </div>
    </div>
  );
};

export default ReportHeader;
