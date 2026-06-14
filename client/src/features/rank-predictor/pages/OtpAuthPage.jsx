import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTheme } from "../useTheme";
import { BASE_URL } from "../../../config.js";
import { RP_BASE, RP_AUTH_KEY } from "../constants.js";
import logo from "../assets/logo.png";

const BACKEND_URL = BASE_URL;

const OtpAuthPage = () => {
  const [phone, setPhone]         = useState("");
  const [sessionId, setSessionId] = useState("");
  const [otp, setOtp]             = useState("");
  const [step, setStep]           = useState("phone");
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendReady, setBackendReady] = useState(!!db); // false until db resolves
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Poll until Firebase db is ready (backend cold-start can take 30-50s)
  useEffect(() => {
    if (db) { setBackendReady(true); return; }
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/config/firebase`,
          { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          clearInterval(interval);
          // reload the module to get the db instance
          window.location.reload();
        }
      } catch { /* still waking up */ }
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  /* ── colours derived from reactive theme ── */
  const bg        = dark ? "#0f172a" : "#ffffff";
  const surface   = dark ? "#1e293b" : "#f8fafc";
  const border    = dark ? "#334155" : "#e2e8f0";
  const txtMain   = dark ? "#f1f5f9" : "#0f172a";
  const txtMuted  = dark ? "#94a3b8" : "#64748b";
  const divider   = dark ? "#1e293b" : "#f1f5f9";
  const inputBg   = dark ? "#0f172a" : "#f8fafc";
  const prefixBg  = dark ? "#1e293b" : "#f1f5f9";

  const sendOtp = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) { setError("Enter a valid 10-digit mobile number."); return; }
    setIsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "nimcet_users"), where("phone", "==", phone)));
      if (!snap.empty) { setError("A report already exists for this number."); return; }
      const res  = await fetch(`${BACKEND_URL}/api/otp/send`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (data.Status === "Success") { setSessionId(data.Details); setStep("otp"); }
      else setError(data.Details || "Failed to send OTP.");
    } catch { setError("Network error — is the backend running?"); }
    finally { setIsLoading(false); }
  };

  const verifyOtp = async () => {
    setError("");
    if (!otp || otp.length < 4) { setError("Enter the OTP you received."); return; }
    setIsLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/otp/verify?sessionId=${sessionId}&otp=${otp}`);
      const data = await res.json();
      if (data.Status === "Success") {
        sessionStorage.setItem(RP_AUTH_KEY, JSON.stringify({ phone, expiry: Date.now() + 3600000 }));
        navigate(`${RP_BASE}/form`, { state: { phone } });
      } else setError(data.Details || "Invalid OTP.");
    } catch { setError("Network error — is the backend running?"); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ display:"flex", flex:1, overflow:"auto", transition:"background 0.3s",
      flexDirection:"column" }}>

      {/* ══ SERVER WAKE-UP BANNER (shown only when backend is cold-starting) ══ */}
      {!backendReady && (
        <div style={{ background:"linear-gradient(90deg,#1e3a8a,#4338ca)", color:"#fff",
          padding:"10px 20px", textAlign:"center", fontSize:"13px", fontWeight:"500",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ animation:"spin 1s linear infinite", flexShrink:0 }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          Waking up server (Render free tier)… please wait 20–40 seconds. Page will refresh automatically.
        </div>
      )}

      {/* ══ MAIN SPLIT LAYOUT ══ */}
      <div style={{ display:"flex", flex:1, overflow:"auto" }}>

      {/* ══ LEFT PANEL — blue gradient, desktop only ══ */}
      <div style={{
        width: "42%", flexShrink:0,
        background: "linear-gradient(145deg,#1e3a8a 0%,#1d4ed8 55%,#0369a1 100%)",
        display: "flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        padding: "60px 48px", position:"relative", overflow:"hidden",
      }} className="hidden lg:flex">
        {/* blobs */}
        {[{t:"-100px",l:"-100px",s:"350px",o:"0.15"},{b:"-80px",r:"-80px",s:"280px",o:"0.1"}].map((b,i)=>
          <div key={i} style={{ position:"absolute", top:b.t, left:b.l, bottom:b.b, right:b.r,
            width:b.s, height:b.s, borderRadius:"50%",
            background:"radial-gradient(circle,rgba(255,255,255,0.9),transparent)",
            opacity:b.o }} />
        )}
        <div style={{ position:"relative", zIndex:1, textAlign:"center", color:"#fff" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"28px" }}>
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:"24px", padding:"18px",
              border:"1px solid rgba(255,255,255,0.25)", backdropFilter:"blur(8px)" }}>
              <img src={logo} alt="ACME" style={{ height:"100px", width:"100px", objectFit:"contain" }} />
            </div>
          </div>
          <h2 style={{ fontSize:"34px", fontWeight:"900", lineHeight:1.2, margin:"0 0 14px",letterSpacing:"-0.5px" }}>
            ACME MCA<br/>Entrance Academy
          </h2>
          <p style={{ fontSize:"15px", color:"rgba(219,234,254,0.9)", lineHeight:1.7, margin:"0 0 32px" }}>
            India's most trusted platform for<br/>NIMCET rank prediction &amp; counselling.
          </p>
          {["AI-powered rank prediction","College eligibility analysis","Instant PDF report download"].map(f=>(
            <div key={f} style={{ display:"flex", alignItems:"center", gap:"10px", margin:"0 0 12px",
              fontSize:"14px", color:"rgba(219,234,254,0.9)", fontWeight:500, textAlign:"left" }}>
              <div style={{ width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.2)",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"48px 32px", backgroundColor:bg,
        overflowY:"auto", transition:"background-color 0.3s" }}>

        {/* Mobile logo */}
        <div className="flex lg:hidden" style={{ flexDirection:"column", alignItems:"center",
          marginBottom:"28px", textAlign:"center" }}>
          <div style={{ background:surface, borderRadius:"18px", padding:"10px",
            border:`1px solid ${border}`, marginBottom:"10px" }}>
            <img src={logo} alt="ACME" style={{ height:"56px", width:"56px", objectFit:"contain" }} />
          </div>
          <div style={{ fontWeight:"700", fontSize:"16px", color:txtMain }}>ACME MCA Entrance Academy</div>
        </div>

        {/* Form content */}
        <div style={{ width:"100%", maxWidth:"420px" }}>
          <div style={{ marginBottom:"32px" }}>
            <h1 style={{ fontSize:"32px", fontWeight:"900", color:txtMain, margin:"0 0 8px", letterSpacing:"-0.5px" }}>
              {step==="phone" ? "Get Started" : "Verify OTP"}
            </h1>
            <p style={{ fontSize:"15px", color:txtMuted, margin:0 }}>
              {step==="phone"
                ? "Enter your registered mobile number to continue"
                : `OTP sent to +91 ${phone}`}
            </p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
            {step==="phone" ? (<>
              <div>
                <label style={{ display:"block", fontSize:"14px", fontWeight:"600", color:txtMain, marginBottom:"8px" }}>
                  Mobile Number
                </label>
                <div style={{ display:"flex", borderRadius:"12px", border:`2px solid ${border}`,
                  overflow:"hidden", background:inputBg, transition:"border-color 0.2s" }}
                  onFocusCapture={e=>e.currentTarget.style.borderColor="#2563eb"}
                  onBlurCapture={e=>e.currentTarget.style.borderColor=border}>
                  <span style={{ padding:"14px 16px", background:prefixBg, borderRight:`2px solid ${border}`,
                    fontSize:"14px", fontWeight:"700", color:txtMuted, flexShrink:0, userSelect:"none" }}>
                    +91
                  </span>
                  <input type="tel" inputMode="numeric" value={phone}
                    onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
                    onKeyDown={e=>e.key==="Enter"&&sendOtp()}
                    placeholder="98765 43210" maxLength={10}
                    style={{ flex:1, padding:"14px 16px", background:"transparent", border:"none",
                      outline:"none", fontSize:"16px", fontWeight:"500", color:txtMain, fontFamily:"inherit" }}/>
                </div>
              </div>
              <Btn onClick={sendOtp} loading={isLoading} label="Send OTP →" />
            </>) : (<>
              <div>
                <label style={{ display:"block", fontSize:"14px", fontWeight:"600", color:txtMain, marginBottom:"8px" }}>
                  Enter OTP
                </label>
                <input type="text" inputMode="numeric" value={otp}
                  onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
                  onKeyDown={e=>e.key==="Enter"&&verifyOtp()}
                  placeholder="------" maxLength={6}
                  style={{ width:"100%", padding:"16px", borderRadius:"12px", border:`2px solid ${border}`,
                    background:inputBg, fontSize:"28px", fontWeight:"700", textAlign:"center",
                    letterSpacing:"0.5em", color:txtMain, outline:"none", boxSizing:"border-box",
                    fontFamily:"monospace", transition:"border-color 0.2s" }}
                  onFocus={e=>e.target.style.borderColor="#2563eb"}
                  onBlur={e=>e.target.style.borderColor=border}/>
              </div>
              <Btn onClick={verifyOtp} loading={isLoading} label="Verify & Continue →" />
              <button onClick={()=>{setStep("phone");setOtp("");setError("");}}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:"14px",
                  fontWeight:"600", color:"#2563eb", padding:"4px", textAlign:"center" }}>
                ← Change phone number
              </button>
            </>)}

            {error && (
              <div style={{ padding:"14px 16px", borderRadius:"12px",
                background: dark?"rgba(239,68,68,0.12)":"#fef2f2",
                border:`1px solid ${dark?"rgba(239,68,68,0.3)":"#fecaca"}`,
                fontSize:"14px", color: dark?"#fca5a5":"#dc2626",
                display:"flex", alignItems:"flex-start", gap:"10px" }}>
                <svg width="18" height="18" style={{ flexShrink:0, marginTop:"1px" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {error}
              </div>
            )}

            <div style={{ marginTop:"12px", paddingTop:"20px", borderTop:`1px solid ${divider}`,
              textAlign:"center", fontSize:"13px", color:txtMuted,
              display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Your data is secure and never shared
            </div>
          </div>
        </div>
      </div>  {/* end main split layout */}
      </div>  {/* end outer column wrapper */}
    </div>
  );
};

/* ── Shared CTA button ── */
const Btn = ({ onClick, loading, label }) => (
  <button onClick={onClick} disabled={loading}
    style={{ width:"100%", padding:"15px", borderRadius:"12px", border:"none",
      background: loading ? "#93c5fd" : "linear-gradient(90deg,#2563eb,#4f46e5)",
      color:"#fff", fontSize:"16px", fontWeight:"700", cursor: loading?"wait":"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
      boxShadow:"0 4px 14px rgba(37,99,235,0.35)", transition:"opacity 0.2s" }}>
    {loading
      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation:"spin 0.8s linear infinite" }}>
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
          <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      : null}
    {loading ? "Please wait…" : label}
  </button>
);

export default OtpAuthPage;
