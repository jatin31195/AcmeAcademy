import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { Flask_URL } from "@/config";
const FLASK_URL = Flask_URL;

const EXAMS = [
  {
    id: "CUET_PG",
    label: "CUET PG",
    icon: "📘",
    tag: "NTA · Entrance Exam",
    gradient: "from-purple-600 to-indigo-600",
    border: "hover:border-purple-400",
    badge: "LIVE",
    badgeCls: "bg-green-100 border-green-300 text-green-700",
    ready: true,
  },
  {
    id: "NIMCET",
    label: "NIMCET",
    icon: "🏛️",
    tag: "NIT · Entrance Exam",
    gradient: "from-pink-600 to-rose-500",
    border: "hover:border-pink-400",
    badge: "SOON",
    badgeCls: "bg-amber-100 border-amber-300 text-amber-700",
    ready: false,
  },
];

// ── Scorecard download ────────────────────────────────────────────────────────
const downloadScoreCard = (result, examLabel) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 660;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, 1000, 560);
  bg.addColorStop(0, "#f8f7ff");
  bg.addColorStop(0.5, "#f3f0ff");
  bg.addColorStop(1, "#fdf2f8");
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(0, 0, 1000, 560, 0); ctx.fill();

  const bar = ctx.createLinearGradient(0, 0, 1000, 0);
  bar.addColorStop(0, "#9333ea");
  bar.addColorStop(0.5, "#7c3aed");
  bar.addColorStop(1, "#ec4899");
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, 1000, 7);

  ctx.fillStyle = "rgba(124,58,237,0.06)";
  for (let x = 50; x < 1000; x += 40)
    for (let y = 50; y < 560; y += 40) {
      ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
    }

  const drawContent = (logoImg) => {
    ctx.fillStyle = "rgba(124,58,237,0.1)";
    ctx.beginPath(); ctx.arc(72, 62, 30, 0, Math.PI * 2); ctx.fill();
    if (logoImg) {
      ctx.save();
      ctx.beginPath(); ctx.arc(72, 62, 27, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(logoImg, 45, 35, 54, 54); ctx.restore();
    }

    ctx.font = "bold 22px Georgia, serif"; ctx.fillStyle = "#1e1b4b";
    ctx.fillText("ACME", 115, 56);
    ctx.font = "600 11px Georgia, serif"; ctx.fillStyle = "#7c3aed";
    ctx.fillText("ACADEMY", 115, 74);
    ctx.font = "500 10px Georgia, serif"; ctx.fillStyle = "#9ca3af";
    ctx.fillText("acmeacademy.in", 115, 90);

    ctx.strokeStyle = "rgba(124,58,237,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(52, 110); ctx.lineTo(948, 110); ctx.stroke();

    ctx.fillStyle = "rgba(124,58,237,0.1)";
    ctx.beginPath(); ctx.roundRect(52, 124, 160, 28, 6); ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.25)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(52, 124, 160, 28, 6); ctx.stroke();
    ctx.font = "bold 11px Georgia, serif"; ctx.fillStyle = "#7c3aed";
    ctx.fillText(`📘 ${examLabel} Score Card`, 66, 143);

    const scoreGrad = ctx.createLinearGradient(52, 150, 52, 310);
    scoreGrad.addColorStop(0, "#7c3aed"); scoreGrad.addColorStop(1, "#ec4899");
    ctx.fillStyle = scoreGrad;
    ctx.font = "bold 108px Georgia, serif";
    ctx.fillText(String(result.score), 52, 295);
    ctx.font = "600 13px Georgia, serif"; ctx.fillStyle = "#9ca3af";
    ctx.fillText("TOTAL SCORE", 52, 318);

    ctx.strokeStyle = "rgba(124,58,237,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(420, 124); ctx.lineTo(420, 360); ctx.stroke();

    const stats = [
      { label: "CORRECT",     val: result.correct,     col: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
      { label: "INCORRECT",   val: result.incorrect,   col: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
      { label: "UNATTEMPTED", val: result.unattempted, col: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
    ];
    stats.forEach((s, i) => {
      const x = 448 + i * 166;
      ctx.fillStyle = s.bg; ctx.beginPath(); ctx.roundRect(x, 148, 150, 112, 12); ctx.fill();
      ctx.strokeStyle = s.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(x, 148, 150, 112, 12); ctx.stroke();
      ctx.font = "bold 46px Georgia, serif"; ctx.fillStyle = s.col; ctx.textAlign = "center";
      ctx.fillText(String(s.val), x + 75, 220);
      ctx.font = "600 10px Georgia, serif"; ctx.fillStyle = "#9ca3af";
      ctx.fillText(s.label, x + 75, 244); ctx.textAlign = "left";
    });

    ctx.font = "500 12px Georgia, serif"; ctx.fillStyle = "#9ca3af";
    ctx.fillText("+4 correct  ·  −1 incorrect  ·  0 unattempted", 448, 298);

    const total = result.correct + result.incorrect + result.unattempted;
    const pct = total > 0 ? result.correct / total : 0;
    ctx.font = "500 11px Georgia, serif"; ctx.fillStyle = "#6b7280";
    ctx.fillText(`Accuracy: ${Math.round(pct * 100)}%`, 448, 326);
    ctx.fillStyle = "#e5e7eb"; ctx.beginPath(); ctx.roundRect(448, 334, 480, 6, 3); ctx.fill();
    const accGrad = ctx.createLinearGradient(448, 0, 928, 0);
    accGrad.addColorStop(0, "#9333ea"); accGrad.addColorStop(1, "#ec4899");
    ctx.fillStyle = accGrad; ctx.beginPath(); ctx.roundRect(448, 334, 480 * pct, 6, 3); ctx.fill();

    // ── Candidate Info Section ────────────────────────────────────────────
    const cand = result.candidate || {};
    const candName   = cand.name    || "—";
    const candAppNo  = cand.app_no  || "—";
    const candRollNo = cand.roll_no || "—";

    // Candidate info box background
    ctx.fillStyle = "rgba(124,58,237,0.05)";
    ctx.beginPath(); ctx.roundRect(52, 370, 896, 70, 10); ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.15)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(52, 370, 896, 70, 10); ctx.stroke();

    // Three columns: Name | Application No | Roll No
    const cols = [
      { label: "CANDIDATE NAME", value: candName,   x: 80  },
      { label: "APPLICATION NO", value: candAppNo,  x: 400 },
      { label: "ROLL NO",        value: candRollNo, x: 700 },
    ];
    cols.forEach(({ label, value, x }) => {
      ctx.font = "600 9px Georgia, serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(label, x, 392);
      ctx.font = "bold 15px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      ctx.fillText(value, x, 413);
    });

    // ── Footer ────────────────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(124,58,237,0.1)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(52, 460); ctx.lineTo(948, 460); ctx.stroke();

    ctx.font = "500 11px Georgia, serif"; ctx.fillStyle = "#9ca3af";
    ctx.fillText("Generated by ACME Academy · acmeacademy.in", 52, 488);
    ctx.fillText(new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }), 52, 508);
    ctx.font = "500 11px Georgia, serif"; ctx.fillStyle = "#7c3aed";
    ctx.fillText("🔗 acmeacademy.in/score-checker", 52, 528);
    ctx.textAlign = "right";
    ctx.font = "italic 11px Georgia, serif"; ctx.fillStyle = "#c4b5fd";
    ctx.fillText("India's Most Trusted MCA Entrance Academy", 948, 488);
    ctx.textAlign = "left";

    ctx.save(); ctx.globalAlpha = 0.03; ctx.font = "bold 130px Georgia, serif";
    ctx.fillStyle = "#7c3aed"; ctx.translate(500, 580); ctx.rotate(-0.15);
    ctx.fillText("ACME", -190, 0); ctx.restore();

    const link = document.createElement("a");
    link.download = `ACME_${examLabel.replace(" ", "_")}_ScoreCard.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  const logoImg = new Image();
  logoImg.src = "/logo.png";
  logoImg.onload  = () => drawContent(logoImg);
  logoImg.onerror = () => drawContent(null);
};

// ── Upload zone ───────────────────────────────────────────────────────────────
const UploadZone = ({ label, icon, file, onFile }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const handle = useCallback((f) => { if (f?.type === "application/pdf") onFile(f); }, [onFile]);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
      className={`
        relative cursor-pointer rounded-2xl p-7 text-center transition-all duration-300 select-none
        ${file
          ? "border-2 border-green-400 bg-green-50"
          : drag
            ? "border-2 border-purple-400 bg-purple-50"
            : "border-2 border-dashed border-gray-200 bg-white hover:border-purple-400 hover:bg-purple-50/50"
        } shadow-sm
      `}
    >
      <input ref={ref} type="file" accept=".pdf" className="hidden"
        onChange={(e) => handle(e.target.files[0])} />
      <div className="text-3xl mb-3">{file ? "✅" : icon}</div>
      <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
      {file
        ? <p className="text-xs text-green-600 font-medium mt-2 break-all">✓ {file.name}</p>
        : <p className="text-xs text-gray-400 mt-1">Drag & drop or click · PDF only</p>
      }
    </motion.div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────
const ScoreCheckerPage = () => {
  const [exam,         setExam]         = useState(null);
  const [step,         setStep]         = useState("info");   // "info" | "upload"
  const [userName,     setUserName]     = useState("");
  const [userPhone,    setUserPhone]    = useState("");
  const [phoneError,   setPhoneError]   = useState("");
  const [responseFile, setResponseFile] = useState(null);
  const [answerFile,   setAnswerFile]   = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [result,       setResult]       = useState(null);
  const [filter,       setFilter]       = useState("All");

  const canSubmit = responseFile && answerFile && !loading;

  const reset = () => {
    setExam(null); setStep("info");
    setUserName(""); setUserPhone(""); setPhoneError("");
    setResponseFile(null); setAnswerFile(null);
    setResult(null); setError(null); setFilter("All");
  };

  const handleInfoNext = () => {
    if (!userName.trim()) return;
    if (!/^\d{10}$/.test(userPhone)) {
      setPhoneError("Enter a valid 10-digit mobile number.");
      return;
    }
    setPhoneError("");
    setStep("upload");
  };

  const handleCheck = async () => {
    if (!canSubmit) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const form = new FormData();
      form.append("response_sheet", responseFile);
      form.append("answer_key",     answerFile);
      form.append("user_name",      userName.trim());
      form.append("user_phone",     `+91${userPhone.trim()}`);
      const res  = await fetch(`${FLASK_URL}/check`, { method: "POST", body: form });
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setResult(data); setFilter("All"); }
    } catch { setError("Network error — make sure the Flask server is running."); }
    finally   { setLoading(false); }
  };

  const filtered = result?.results
    ? (filter === "All" ? result.results : result.results.filter(r => r.status === filter))
    : [];

  const pct = result
    ? Math.round((result.correct / (result.correct + result.incorrect + result.unattempted)) * 100)
    : 0;

  return (
    <>
      <SEO
        title="Score Checker — CUET PG & NIMCET | ACME Academy"
        description="Instantly check your CUET PG or NIMCET score. Upload NTA response sheet & answer key PDFs and get a downloadable score card from ACME Academy."
        url="https://www.acmeacademy.in/score-checker"
        keywords="CUET PG score checker, NIMCET marks calculator, NTA response sheet checker, ACME Academy score card download"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

        {/* Hero */}
        <section className="relative py-16 sm:py-26 text-center overflow-hidden hero-gradient">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-3xl rotate-45 scale-150" />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl mb-4">
                <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">Score</span>{" "}
                <span className="text-white">Checker</span>
              </h1>
              <p className="font-semibold text-lg sm:text-xl text-white/90 max-w-xl mx-auto leading-relaxed mb-4">
                Know your score <span className="text-pink-300 font-bold">before results are out.</span>
              </p>
              <p className="font-medium text-sm sm:text-base text-white/60 max-w-lg mx-auto leading-relaxed mb-6">
                India's only MCA-focused score checker — built by ACME Academy experts who know these exams inside out.
                Upload your NTA PDFs and get your exact score, accuracy & a branded result card in seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {["⚡ Instant Results", "🔒 100% Private", "📄 Downloadable Card", "🎯 CUET PG & NIMCET"].map((b) => (
                  <span key={b} className="bg-white/10 backdrop-blur border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">{b}</span>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-full h-16" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z" fill="white" />
            </svg>
          </div>
        </section>

        <div className="relative max-w-4xl mx-auto px-4 py-12 pb-24">
          <AnimatePresence mode="wait">

            {/* ── EXAM SELECTION ── */}
            {!exam && (
              <motion.div key="exam-select" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <p className="text-center text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-8">Select Your Exam</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  {EXAMS.map((e, i) => (
                    <motion.button key={e.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                      onClick={() => { setExam(e.id); setStep("info"); }}
                      whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}
                      className={`relative group rounded-3xl p-8 text-left bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden ${e.border}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${e.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                      <div className={`absolute top-4 right-4 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${e.badgeCls}`}>{e.badge}</div>
                      <div className="text-4xl mb-4">{e.icon}</div>
                      <h3 className="text-2xl font-extrabold text-gray-800 mb-1">{e.label}</h3>
                      <p className="text-xs text-gray-400 font-medium tracking-widest">{e.tag}</p>
                      <div className={`mt-5 h-0.5 w-10 bg-gradient-to-r ${e.gradient} rounded-full group-hover:w-20 transition-all duration-500`} />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── NIMCET COMING SOON ── */}
            {exam === "NIMCET" && (
              <motion.div key="nimcet" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center max-w-lg mx-auto py-10">
                <div className="text-7xl mb-6">🚧</div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Coming Soon</h2>
                <p className="text-gray-500 leading-relaxed mb-8">We are working at high speed to deliver you the most accurate NIMCET score checker.</p>
                <button onClick={reset} className="bg-white border border-gray-200 hover:border-purple-400 text-gray-600 hover:text-purple-600 px-8 py-3 rounded-full text-sm font-semibold transition-all shadow-sm">← Choose Another Exam</button>
              </motion.div>
            )}

            {/* ── STEP 1: NAME & PHONE ── */}
            {exam === "CUET_PG" && step === "info" && !result && (
              <motion.div key="info-step" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={reset} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">← Change Exam</button>
                  <span className="text-gray-200">|</span>
                  <span className="text-purple-600 text-sm font-semibold">📘 CUET PG</span>
                </div>

                <div className="max-w-md mx-auto bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-8">
                  <p className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-6 text-center">Step 1 of 2 — Your Details</p>

                  {/* Name */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Kumar"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm text-gray-800 bg-white transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number <span className="text-red-400">*</span></label>
                    <div className="flex gap-2">
                      {/* India +91 fixed */}
                      <div className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600 select-none shrink-0">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit number"
                        value={userPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setUserPhone(val);
                          if (phoneError) setPhoneError("");
                        }}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm text-gray-800 bg-white transition-all"
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-xs mt-1.5">{phoneError}</p>}
                  </div>

                  <p className="text-xs text-gray-400 mb-6">Your details are only used to personalise your score card.</p>

                  <motion.button
                    onClick={handleInfoNext}
                    disabled={!userName.trim() || userPhone.length !== 10}
                    whileHover={userName.trim() && userPhone.length === 10 ? { scale: 1.03 } : {}}
                    whileTap={userName.trim()  && userPhone.length === 10 ? { scale: 0.97 } : {}}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue to Upload →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: FILE UPLOAD ── */}
            {exam === "CUET_PG" && step === "upload" && !result && (
              <motion.div key="cuet-upload" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-8">
                  <button onClick={() => setStep("info")} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">← Back</button>
                  <span className="text-gray-200">|</span>
                  <span className="text-purple-600 text-sm font-semibold">📘 CUET PG</span>
                  <span className="text-gray-200">|</span>
                  {/* show name they entered */}
                  <span className="text-gray-500 text-sm">👤 {userName}</span>
                </div>

                {/* steps strip */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-md px-6 py-4 mb-8 flex flex-wrap gap-5 items-center">
                  {[
                    ["1️⃣", "Download Response Sheet from NTA portal"],
                    ["2️⃣", "Download Official Answer Key from NTA"],
                    ["3️⃣", "Upload both PDFs below & calculate"],
                  ].map(([n, t]) => (
                    <div key={n} className="flex items-center gap-2">
                      <span>{n}</span>
                      <span className="text-xs text-gray-500">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <UploadZone label="Response Sheet PDF" icon="📄" file={responseFile} onFile={setResponseFile} />
                  <UploadZone label="Answer Key PDF"     icon="🔑" file={answerFile}   onFile={setAnswerFile}   />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-600 text-sm mb-6 whitespace-pre-wrap">
                      ❌ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center">
                  <motion.button
                    onClick={handleCheck}
                    disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.04 } : {}}
                    whileTap={canSubmit  ? { scale: 0.97 } : {}}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-14 py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <span className="flex items-center gap-3 justify-center">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing PDFs…
                        </span>
                      : "Calculate My Score →"
                    }
                  </motion.button>
                  <p className="text-gray-400 text-xs mt-3">Files processed locally · Never stored</p>
                </div>
              </motion.div>
            )}

            {/* ── RESULTS ── */}
            {exam === "CUET_PG" && result && (
              <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <button onClick={reset} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">← Check Another</button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => downloadScoreCard(result, "CUET PG")}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    <img src="/logo.png" alt="ACME" className="h-4 w-auto object-contain" />
                    Download Score Card
                  </motion.button>
                </div>

                {/* score hero */}
                <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl p-10 text-center mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent pointer-events-none rounded-3xl" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full border border-purple-200/40" />
                    <div className="absolute w-44 h-44 rounded-full border border-pink-200/40" />
                  </div>
                  <p className="text-xs text-gray-400 font-bold tracking-[0.2em] uppercase mb-4">🎯 Your Final Score</p>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="text-[88px] sm:text-[110px] font-extrabold leading-none bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-transparent mb-3"
                  >
                    {result.score}
                  </motion.div>
                  <p className="text-gray-400 text-sm">+4 correct · −1 incorrect · 0 unattempted</p>
                  <div className="mt-6 max-w-xs mx-auto">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Accuracy</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* stat cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "✅ Correct",     val: result.correct,     col: "text-green-600", bg: "bg-green-50  border-green-200"  },
                    { label: "❌ Incorrect",   val: result.incorrect,   col: "text-red-500",   bg: "bg-red-50    border-red-200"    },
                    { label: "⚪ Unattempted", val: result.unattempted, col: "text-gray-500",  bg: "bg-gray-50   border-gray-200"   },
                  ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                      className={`${s.bg} border rounded-2xl p-5 text-center shadow-sm`}>
                      <div className={`text-4xl font-extrabold ${s.col}`}>{s.val}</div>
                      <div className="text-xs text-gray-400 mt-2 font-semibold">{s.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* promo */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                  className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 border border-purple-200/50 rounded-2xl px-6 py-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">Want to improve your score?</p>
                    <p className="text-xs text-gray-500">Join ACME Academy — India's Most Trusted MCA Entrance Coaching</p>
                  </div>
                  <Link to="/contact-acme-academy">
                    <motion.button whileHover={{ scale: 1.05 }}
                      className="shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap">
                      Enroll Now →
                    </motion.button>
                  </Link>
                </motion.div>

                {/* table */}
                <div>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h2 className="text-base font-extrabold text-gray-800">📊 Question-wise Analysis</h2>
                    <p className="text-xs text-gray-400">{result.results.length} questions total</p>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-5">
                    {["All", "Correct", "Incorrect", "Unattempted"].map(f => {
                      const count = f === "All" ? result.results.length : result.results.filter(r => r.status === f).length;
                      return (
                        <button key={f} onClick={() => setFilter(f)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200
                            ${filter === f
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md"
                              : "bg-white border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600"}`}>
                          {f} <span className="opacity-60 ml-1">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/60 backdrop-blur-xl shadow-md">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 bg-white/80">
                          {["#", "Question ID", "Your Option", "Correct Option", "Status"].map(h => (
                            <th key={h} className="px-4 py-3 text-left text-gray-400 font-bold tracking-wider uppercase">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((row, i) => (
                          <tr key={row.qid} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                            <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                            <td className="px-4 py-3 text-gray-500 font-mono">{row.qid}</td>
                            <td className="px-4 py-3 text-gray-700 font-mono">{row.yours}</td>
                            <td className="px-4 py-3 text-gray-700 font-mono">{row.correct}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold
                                ${row.status === "Correct"   ? "bg-green-100 text-green-700" :
                                  row.status === "Incorrect" ? "bg-red-100   text-red-600"   :
                                                               "bg-gray-100  text-gray-500"  }`}>
                                {row.status === "Correct" ? "🟢" : row.status === "Incorrect" ? "🔴" : "⚪"} {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filtered.length === 0 && (
                          <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">No questions match this filter.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ScoreCheckerPage;