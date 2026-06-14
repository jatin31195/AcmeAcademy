import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { useTheme } from "../useTheme";
import { RP_BASE, RP_AUTH_KEY } from "../constants.js";
import logo from "../assets/logo.png";

export default function FormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const phone = location.state?.phone || JSON.parse(sessionStorage.getItem(RP_AUTH_KEY) || "{}").phone;

  const [form, setForm] = useState({ name:"", marks:"", category:"General", regNo:"", city:"", state:"" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!phone) navigate(RP_BASE);
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => window.history.go(1);
  }, [navigate, phone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: name === "regNo" ? value.toUpperCase() : value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())               return setError("Full name is required.");
    if (!form.regNo.startsWith("NIT2025"))return setError("Registration number must start with 'NIT2025'.");
    const marks = parseInt(form.marks);
    if (isNaN(marks)||marks<0||marks>1000) return setError("Enter valid marks between 0 and 1000.");
    if (!form.city.trim())               return setError("City is required.");
    if (!form.state.trim())              return setError("State is required.");

    setSubmitting(true);
    try {
      const q = query(collection(db,"nimcet_users"), where("phone","==",phone));
      const snap = await getDocs(q);
      if (!snap.empty) { navigate(`${RP_BASE}/report`,{state:snap.docs[0].data()}); return; }

      const marksData  = (await import("../data/marks_to_rank.json")).default;
      const cutoffData = (await import("../data/college_cutoffs.json")).default;

      let predictedRank = null;
      for (const r of marksData) {
        if (marks>=r.min_marks && marks<=r.max_marks) { predictedRank=r.rank_low; break; }
      }

      const catList = cutoffData[form.category]||[];
      let topCollege=null, fallbackCollege=null;
      for (const e of catList) {
        if (predictedRank>=e.low && predictedRank<=e.high) { topCollege=e.college; break; }
      }
      const eligible = catList.filter(e=>predictedRank<=e.high);
      if (eligible.length>1) fallbackCollege=eligible[1]?.college||null;

      const payload = {
        name:form.name.trim(), phone, marks, category:form.category,
        regNo:form.regNo.trim(), city:form.city.trim(), state:form.state.trim(),
        rank:predictedRank, topCollege, fallbackCollege, createdAt:serverTimestamp(),
      };
      await addDoc(collection(db,"nimcet_users"), payload);
      navigate(`${RP_BASE}/report`,{state:payload});
    } catch(err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  };

  /* ── colour tokens ── */
  const pageBg     = dark ? "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)"
                           : "linear-gradient(135deg,#eff6ff 0%,#e0e7ff 100%)";
  const cardBg     = dark ? "#1e293b" : "#ffffff";
  const cardBorder = dark ? "#334155" : "#e2e8f0";
  const txtMain    = dark ? "#f1f5f9" : "#0f172a";
  const txtMuted   = dark ? "#94a3b8" : "#64748b";
  const inputBg    = dark ? "#0f172a" : "#f8fafc";
  const inputBdr   = dark ? "#334155" : "#e2e8f0";
  const lblColor   = dark ? "#cbd5e1" : "#374151";

  const inputStyle = {
    width:"100%", padding:"12px 14px", borderRadius:"10px",
    border:`2px solid ${inputBdr}`, background:inputBg,
    fontSize:"15px", color:txtMain, outline:"none",
    boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s",
  };
  const labelStyle = { display:"block", fontSize:"13px", fontWeight:"600",
    color:lblColor, marginBottom:"6px" };

  return (
    <div style={{ flex:1, display:"flex", alignItems:"flex-start", justifyContent:"center",
      padding:"32px 16px", overflowY:"auto", background:pageBg, transition:"background 0.3s" }}>

      <div style={{ width:"100%", maxWidth:"640px" }}>
        {/* Card */}
        <div style={{ background:cardBg, borderRadius:"24px", border:`1px solid ${cardBorder}`,
          boxShadow: dark
            ? "0 25px 50px rgba(0,0,0,0.4)"
            : "0 20px 60px rgba(37,99,235,0.12)",
          overflow:"hidden", transition:"background 0.3s" }}>

          {/* Accent bar */}
          <div style={{ height:"4px", background:"linear-gradient(90deg,#2563eb,#7c3aed)" }}/>

          <div style={{ padding:"32px" }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", gap:"16px", marginBottom:"28px",
              paddingBottom:"24px", borderBottom:`1px solid ${cardBorder}` }}>
              <div style={{ background: dark?"#0f172a":"#f1f5f9", borderRadius:"16px", padding:"10px",
                border:`1px solid ${cardBorder}`, flexShrink:0 }}>
                <img src={logo} alt="ACME" style={{ height:"44px", width:"44px", objectFit:"contain" }}/>
              </div>
              <div>
                <h1 style={{ fontSize:"20px", fontWeight:"800", color:txtMain, margin:"0 0 4px" }}>
                  ACME Rank Predictor
                </h1>
                <p style={{ fontSize:"14px", color:txtMuted, margin:0 }}>
                  Fill in your details for an instant AI prediction
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Row 1 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    required placeholder="e.g. Rahul Sharma" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#2563eb"}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                </div>
                <div>
                  <label style={labelStyle}>Phone (verified)</label>
                  <div style={{ ...inputStyle, color:txtMuted, cursor:"not-allowed",
                    background: dark?"#1e293b":"#f1f5f9" }}>
                    +91 {phone}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                <div>
                  <label style={labelStyle}>Total Marks (0 – 1000)</label>
                  <input name="marks" value={form.marks} onChange={handleChange}
                    required type="number" min={0} max={1000} placeholder="e.g. 480" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#2563eb"}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                  <p style={{ marginTop:"6px", fontSize:"12px", color:"#d97706",
                    display:"flex", alignItems:"center", gap:"4px" }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Only 1 result allowed per device
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    style={{ ...inputStyle, appearance:"none", cursor:"pointer" }}>
                    {["General","EWS","OBC","SC","ST","PWD"].map(c=>(
                      <option key={c} value={c} style={{ background: dark?"#1e293b":"#fff" }}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Registration */}
              <div style={{ marginBottom:"16px" }}>
                <label style={labelStyle}>Registration Number</label>
                <input name="regNo" value={form.regNo} onChange={handleChange}
                  required placeholder="NIT2025XXXXXX" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor="#2563eb"}
                  onBlur={e=>e.target.style.borderColor=inputBdr}/>
                <p style={{ marginTop:"5px", fontSize:"12px", color:txtMuted }}>Must begin with NIT2025</p>
              </div>

              {/* Row 3 */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"24px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    required placeholder="e.g. Patna" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#2563eb"}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    required placeholder="e.g. Bihar" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#2563eb"}
                    onBlur={e=>e.target.style.borderColor=inputBdr}/>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ marginBottom:"20px", padding:"12px 16px", borderRadius:"10px",
                  background: dark?"rgba(239,68,68,0.1)":"#fef2f2",
                  border:`1px solid ${dark?"rgba(239,68,68,0.25)":"#fecaca"}`,
                  fontSize:"14px", color: dark?"#fca5a5":"#dc2626",
                  display:"flex", alignItems:"center", gap:"8px" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={submitting}
                style={{ width:"100%", padding:"15px", borderRadius:"12px", border:"none",
                  background: submitting?"#93c5fd":"linear-gradient(90deg,#2563eb,#7c3aed)",
                  color:"#fff", fontSize:"16px", fontWeight:"700",
                  cursor: submitting?"wait":"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                  boxShadow:"0 4px 16px rgba(37,99,235,0.35)" }}>
                {submitting ? (<>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation:"spin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  </svg>
                  Generating Report…
                </>) : (<>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Generate AI Report
                </>)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
