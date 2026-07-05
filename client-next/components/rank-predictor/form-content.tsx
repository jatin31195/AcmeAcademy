"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/rank-predictor/firebase";
import { useTheme } from "@/lib/rank-predictor/use-theme";
import Image from "next/image";
import { RP_BASE, RP_AUTH_KEY, RP_REPORT_DATA_KEY } from "@/lib/rank-predictor/constants";

// Ported from client/src/features/rank-predictor/pages/FormPage.jsx.
//
// Two adaptations required by the move from React Router to Next.js
// (documented once here, both are the same underlying cause):
// 1. The original read `phone` from `location.state?.phone`, falling back to
//    sessionStorage only as a secondary path. Next.js Client Components on
//    different routes have no shared router-state channel, so this now
//    reads solely from sessionStorage — the fallback the original already
//    had, promoted to the only path (OtpAuthPage already writes it before
//    navigating here, so behavior is unchanged for the actual user flow).
// 2. The original navigated to /report via `navigate(path, { state: payload })`.
//    Here the same payload is written to sessionStorage under
//    RP_REPORT_DATA_KEY immediately before navigating, and ReportPage reads
//    it back — see constants.ts for the full rationale.
export default function FormPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [phone, setPhoneState] = useState("");

  useEffect(() => {
    const cached = JSON.parse(sessionStorage.getItem(RP_AUTH_KEY) || "{}").phone;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only sessionStorage read, ported behavior
    setPhoneState(cached || "");
    if (!cached) router.push(RP_BASE);
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, [router]);

  const [form, setForm] = useState({ name: "", marks: "", category: "General", regNo: "", city: "", state: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "regNo" ? value.toUpperCase() : value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Full name is required.");
    if (!form.regNo.startsWith("NIT2026")) return setError("Registration number must start with 'NIT2026'.");
    const marks = parseInt(form.marks);
    if (isNaN(marks) || marks < 0 || marks > 1000) return setError("Enter valid marks between 0 and 1000.");
    if (!form.city.trim()) return setError("City is required.");
    if (!form.state.trim()) return setError("State is required.");

    setSubmitting(true);
    try {
      const q = query(collection(db!, "nimcet_users"), where("phone", "==", phone));
      const snap = await getDocs(q);

      // Allow up to 2 reports per phone. Existing docs (created before this
      // change) have no `attempts` field, so they count as 1 already used.
      let attempts = 0;
      let existingDocRef = null;
      if (!snap.empty) {
        existingDocRef = snap.docs[0].ref;
        attempts = snap.docs[0].data().attempts || 1;
        if (attempts >= 2) {
          setError("You have reached the maximum limit of 2 reports.");
          setSubmitting(false);
          return;
        }
      }

      const marksData = (await import("@/data/rank-predictor/marks_to_rank.json")).default as { min_marks: number; max_marks: number; rank_low: number }[];
      const cutoffData = (await import("@/data/rank-predictor/college_cutoffs.json")).default as Record<string, { college: string; low: number; high: number }[]>;

      let predictedRank: number | null = null;
      for (const r of marksData) {
        if (marks >= r.min_marks && marks <= r.max_marks) {
          predictedRank = r.rank_low;
          break;
        }
      }

      const catList = cutoffData[form.category] || [];
      let topCollege: string | null = null;
      let fallbackCollege: string | null = null;
      for (const e of catList) {
        if (predictedRank !== null && predictedRank >= e.low && predictedRank <= e.high) {
          topCollege = e.college;
          break;
        }
      }
      const eligible = predictedRank !== null ? catList.filter((e) => predictedRank! <= e.high) : [];
      if (eligible.length > 1) fallbackCollege = eligible[1]?.college || null;

      const payload = {
        name: form.name.trim(),
        phone,
        marks,
        category: form.category,
        regNo: form.regNo.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        rank: predictedRank,
        topCollege,
        fallbackCollege,
        createdAt: serverTimestamp(),
        attempts: attempts + 1,
      };
      // Update the existing report (2nd attempt) or create the first one.
      if (existingDocRef) {
        await updateDoc(existingDocRef, payload);
      } else {
        await addDoc(collection(db!, "nimcet_users"), payload);
      }
      sessionStorage.setItem(RP_REPORT_DATA_KEY, JSON.stringify(payload));
      router.push(`${RP_BASE}/report`);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── colour tokens ── */
  const pageBg = dark ? "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)" : "linear-gradient(135deg,#eff6ff 0%,#e0e7ff 100%)";
  const cardBg = dark ? "#1e293b" : "#ffffff";
  const cardBorder = dark ? "#334155" : "#e2e8f0";
  const txtMain = dark ? "#f1f5f9" : "#0f172a";
  const txtMuted = dark ? "#94a3b8" : "#64748b";
  const inputBg = dark ? "#0f172a" : "#f8fafc";
  const inputBdr = dark ? "#334155" : "#e2e8f0";
  const lblColor = dark ? "#cbd5e1" : "#374151";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: `2px solid ${inputBdr}`,
    background: inputBg,
    fontSize: "15px",
    color: txtMain,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "13px", fontWeight: "600", color: lblColor, marginBottom: "6px" };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px", overflowY: "auto", background: pageBg, transition: "background 0.3s" }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>
        {/* Card */}
        <div
          style={{
            background: cardBg,
            borderRadius: "24px",
            border: `1px solid ${cardBorder}`,
            boxShadow: dark ? "0 25px 50px rgba(0,0,0,0.4)" : "0 20px 60px rgba(37,99,235,0.12)",
            overflow: "hidden",
            transition: "background 0.3s",
          }}
        >
          {/* Accent bar */}
          <div style={{ height: "4px", background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />

          <div style={{ padding: "32px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px", paddingBottom: "24px", borderBottom: `1px solid ${cardBorder}` }}>
              <div style={{ background: dark ? "#0f172a" : "#f1f5f9", borderRadius: "16px", padding: "10px", border: `1px solid ${cardBorder}`, flexShrink: 0 }}>
                <Image src="/logo.png" alt="ACME" width={842} height={711} style={{ height: "44px", width: "44px", objectFit: "contain" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "800", color: txtMain, margin: "0 0 4px" }}>ACME Rank Predictor</h1>
                <p style={{ fontSize: "14px", color: txtMuted, margin: 0 }}>Fill in your details for an instant AI prediction</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = inputBdr)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone (verified)</label>
                  <div style={{ ...inputStyle, color: txtMuted, cursor: "not-allowed", background: dark ? "#1e293b" : "#f1f5f9" }}>+91 {phone}</div>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={labelStyle}>Total Marks (0 – 1000)</label>
                  <input
                    name="marks"
                    value={form.marks}
                    onChange={handleChange}
                    required
                    type="number"
                    min={0}
                    max={1000}
                    placeholder="e.g. 480"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = inputBdr)}
                  />
                  <p style={{ marginTop: "6px", fontSize: "12px", color: "#d97706", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Only 1 result allowed per device
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    {["General", "EWS", "OBC", "SC", "ST", "PWD"].map((c) => (
                      <option key={c} value={c} style={{ background: dark ? "#1e293b" : "#fff" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Registration */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Registration Number</label>
                <input
                  name="regNo"
                  value={form.regNo}
                  onChange={handleChange}
                  required
                  placeholder="NIT2026XXXXXX"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.target.style.borderColor = inputBdr)}
                />
                <p style={{ marginTop: "5px", fontSize: "12px", color: txtMuted }}>Must begin with NIT2026</p>
              </div>

              {/* Row 3 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Patna"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = inputBdr)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Bihar"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = inputBdr)}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    marginBottom: "20px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: dark ? "rgba(239,68,68,0.1)" : "#fef2f2",
                    border: `1px solid ${dark ? "rgba(239,68,68,0.25)" : "#fecaca"}`,
                    fontSize: "14px",
                    color: dark ? "#fca5a5" : "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  background: submitting ? "#93c5fd" : "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: submitting ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.35)",
                }}
              >
                {submitting ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Generating Report…
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Generate AI Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
