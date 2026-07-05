"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BASE_URL } from "@/lib/config";
import { useUser } from "@/providers/user-provider";

// Ported from client/src/pages/profile.jsx. The original defines Toast,
// FormSection, FileUpload, LivePhotoCapture, SignaturePad, and
// TermsAndConditions as local component functions inside this same file
// rather than separate component files — preserved exactly as one file to
// avoid an unrequested refactor.
//
// Two things intentionally NOT ported:
// - `buildVerificationCardImage` (plus its only two callers, `loadImage`
//   and `readFileAsDataUrl`) is defined in the original but never invoked
//   anywhere in the file — confirmed dead code, same category as the
//   already-documented QuestionCard/QuestionPalette/TimerHeader omissions.
// - `client/src/components/profile/WelcomeLetter.jsx` is never imported by
//   this page or anywhere else in the app — confirmed dead/unreachable code
//   via grep, also omitted.

const TARGET_EXAMS = ["CUET", "NIMCET", "MAHCET", "Other"];
const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
const ID_TYPES = ["Aadhar Card", "Government ID", "College ID Proof"];
const YEARS = ["2025", "2026", "2027", "2028", "2029"];
const BATCH_OPTIONS = ["RBC", "Target Batch", "Dropper Batch", "Acme Premium Batch", "Acme Special Batch"];

const TERMS_PROMOTION_CLAUSE =
  "Students must complete their profile after enrolling by providing correct personal and academic details. If a student secures a good rank or selection in NIMCET or any MCA entrance exam, the institute may use the student's name, photo, rank, and result for promotional purposes on the website, social media, or other educational materials. By enrolling in the course, students agree to these profile completion and promotion terms.";

type FormState = {
  fullName: string;
  mobile: string;
  email: string;
  idType: string;
  idFront: File | null;
  idBack: File | null;
  marksheet: File | null;
  passportPhoto: File | null;
  livePhoto: string | null;
  signature: string | null;
  targetExams: string[];
  applicationForms: Record<string, File | null>;
  fatherName: string;
  motherName: string;
  parentsContact: string;
  city: string;
  state: string;
  address: string;
  targetYear: string;
  batchesEnrolled: string;
  termsAccepted: boolean;
};

const initialData: FormState = {
  fullName: "",
  mobile: "",
  email: "",
  idType: "",
  idFront: null,
  idBack: null,
  marksheet: null,
  passportPhoto: null,
  livePhoto: null,
  signature: null,
  targetExams: [],
  applicationForms: {},
  fatherName: "",
  motherName: "",
  parentsContact: "",
  city: "",
  state: "",
  address: "",
  targetYear: "",
  batchesEnrolled: "",
  termsAccepted: false,
};

const compressImageFile = async (
  file: File | null,
  { maxWidth = 1400, maxHeight = 1400, quality = 0.72 }: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<File | null> => {
  if (!file || !String(file.type || "").startsWith("image/")) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (!width || !height) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }

      const scale = Math.min(maxWidth / width, maxHeight / height, 1);
      const targetWidth = Math.max(1, Math.round(width * scale));
      const targetHeight = Math.max(1, Math.round(height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }

          const safeBase = file.name.replace(/\.[^.]+$/, "") || "upload";
          resolve(new File([blob], `${safeBase}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
};

function Toast({ msg, type }: { msg?: string | null; type?: string }) {
  if (!msg) return null;
  const bg = type === "success" ? "#dcfce7" : "#fee2e2";
  const color = type === "success" ? "#166534" : "#991b1b";
  const border = type === "success" ? "#86efac" : "#fca5a5";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "12px 20px",
        borderRadius: 8,
        fontSize: 14,
        zIndex: 9999,
        background: bg,
        color,
        border: `0.5px solid ${border}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {msg}
    </div>
  );
}

function FormSection({ title, icon, step, children }: { title: string; icon: string; step: number; children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid rgba(0,0,0,0.12)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          paddingBottom: 12,
          borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#e53e3e,#3b82f6)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {step}
        </div>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function FileUpload({
  label,
  onChange,
  value,
  required,
  accept = "image/*",
  hint,
}: {
  label: string;
  onChange: (file: File | null) => void;
  value: File | null;
  required?: boolean;
  accept?: string;
  hint?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const hasFile = !!value;

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
        {label}
        {required && <span style={{ color: "#e53e3e" }}> *</span>}
      </label>
      {hint && <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{hint}</div>}

      <div
        onClick={() => ref.current && ref.current.click()}
        style={{
          border: `1.5px dashed ${hasFile ? "#16a34a" : "rgba(0,0,0,0.25)"}`,
          background: hasFile ? "#f0fdf4" : "#fafafa",
          borderRadius: 8,
          padding: 16,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <input ref={ref} type="file" accept={accept} style={{ display: "none" }} onChange={(e) => onChange(e.target.files?.[0] || null)} />
        <div style={{ fontSize: 13, color: hasFile ? "#16a34a" : "#888" }}>{hasFile ? `✓ ${value.name}` : "Click to upload"}</div>
      </div>
    </div>
  );
}

const outlineBtn: CSSProperties = {
  background: "transparent",
  border: "0.5px solid rgba(0,0,0,0.25)",
  padding: "8px 14px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  color: "#1a1a1a",
  fontFamily: "inherit",
};

function LivePhotoCapture({ onChange, value }: { onChange: (v: string | null) => void; value: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [videoReady, setVideoReady] = useState(false);

  const stopStream = (currentStream: MediaStream | null) => {
    if (!currentStream) return;
    currentStream.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    return () => {
      stopStream(stream);
    };
  }, [stream]);

  useEffect(() => {
    if (!active || !stream || !videoRef.current) return;

    const videoEl = videoRef.current;
    setVideoReady(false);
    videoEl.srcObject = stream;

    const markReady = () => setVideoReady(true);
    videoEl.addEventListener("loadedmetadata", markReady);
    videoEl.addEventListener("loadeddata", markReady);
    videoEl.play().catch(() => {});

    return () => {
      videoEl.removeEventListener("loadedmetadata", markReady);
      videoEl.removeEventListener("loadeddata", markReady);
      if (videoEl.srcObject === stream) {
        videoEl.srcObject = null;
      }
    };
  }, [active, stream]);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera is not supported on this device/browser.");
      return;
    }

    try {
      setCameraError("");
      stopStream(stream);

      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(s);
      setActive(true);
    } catch {
      setCameraError("Unable to access camera. Please allow permission and try again.");
      setActive(false);
      setStream(null);
    }
  };

  const capture = async () => {
    if (!videoRef.current) return;

    if (!videoReady || videoRef.current.readyState < 2 || videoRef.current.currentTime === 0) {
      setCameraError("Camera is still initializing. Please wait a moment and try again.");
      return;
    }

    const width = videoRef.current.videoWidth || videoRef.current.clientWidth || 640;
    const height = videoRef.current.videoHeight || videoRef.current.clientHeight || 480;
    if (!width || !height) {
      setCameraError("Camera is not ready yet. Please wait a second and capture again.");
      return;
    }

    const maxWidth = 640;
    const scale = width > maxWidth ? maxWidth / width : 1;
    const outWidth = Math.max(1, Math.round(width * scale));
    const outHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    ctx.drawImage(videoRef.current, 0, 0, outWidth, outHeight);
    onChange(canvas.toDataURL("image/jpeg", 0.7));
    setCameraError("");

    stopStream(stream);
    setActive(false);
    setStream(null);
    setVideoReady(false);
  };

  const closeCamera = () => {
    stopStream(stream);
    setActive(false);
    setStream(null);
    setVideoReady(false);
  };

  const retake = () => {
    onChange(null);
    setCameraError("");
    start();
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        Live Photo for Verification <span style={{ color: "#e53e3e" }}>*</span>
      </label>

      {!active && !value && (
        <button type="button" onClick={start} style={outlineBtn}>
          Open Camera
        </button>
      )}

      {cameraError && <div style={{ marginTop: 8, fontSize: 12, color: "#b91c1c" }}>{cameraError}</div>}

      {active && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 8,
              border: "0.5px solid rgba(0,0,0,0.15)",
            }}
          />
          {!videoReady && <div style={{ fontSize: 12, color: "#555" }}>Starting camera...</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={capture} style={outlineBtn} disabled={!videoReady}>
              Capture Photo
            </button>
            <button type="button" onClick={closeCamera} style={outlineBtn}>
              Close Camera
            </button>
          </div>
        </div>
      )}

      {value && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URL from canvas capture, not next/image-optimizable */}
          <img src={value} alt="live" style={{ width: 160, borderRadius: 8, border: "0.5px solid #16a34a" }} />
          <div style={{ fontSize: 12, color: "#16a34a" }}>✓ Live photo captured</div>
          <button type="button" onClick={retake} style={outlineBtn}>
            Retake
          </button>
        </div>
      )}
    </div>
  );
}

function SignaturePad({ onChange, value }: { onChange: (v: string | null) => void; value: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const r = canvas.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    if (!canvasRef.current) return;
    lastPos.current = getPos(e, canvasRef.current);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    e.preventDefault();

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e, canvasRef.current);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const end = () => {
    drawing.current = false;
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL("image/jpeg", 0.8));
    }
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange(null);
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        Signature <span style={{ color: "#e53e3e" }}>*</span>
      </label>

      <canvas
        ref={canvasRef}
        width={500}
        height={120}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        style={{
          width: "100%",
          maxWidth: 500,
          height: 120,
          display: "block",
          border: "0.5px solid rgba(0,0,0,0.2)",
          borderRadius: 8,
          cursor: "crosshair",
          background: "#fff",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
        <button type="button" onClick={clear} style={outlineBtn}>
          Clear
        </button>
        {value && <span style={{ fontSize: 12, color: "#16a34a" }}>✓ Signature saved</span>}
      </div>
    </div>
  );
}

function TermsAndConditions({ accepted, onChange }: { accepted: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: "#f8f8f8",
          borderRadius: 8,
          padding: 14,
          fontSize: 13,
          color: "#555",
          maxHeight: 160,
          overflowY: "auto",
          lineHeight: 1.7,
        }}
      >
        <strong>Terms and Conditions — ACME Academy</strong>
        <br />
        1. Fees once paid are non-refundable unless the batch is cancelled by the Academy.
        <br />
        2. Students are expected to maintain discipline and respect fellow students and faculty.
        <br />
        3. Personal information provided will be used solely for academic and administrative purposes.
        <br />
        4. Any misconduct may result in termination of enrollment without refund.
        <br />
        5. ACME Academy reserves the right to modify schedules or faculty without prior notice.
        <br />
        6. By submitting this form, you consent to receive communications from ACME Academy.
        <br />
        7. {TERMS_PROMOTION_CLAUSE}
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div
          onClick={() => onChange(!accepted)}
          style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            flexShrink: 0,
            border: `1.5px solid ${accepted ? "#3b82f6" : "#aaa"}`,
            background: accepted ? "#3b82f6" : "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 11,
          }}
        >
          {accepted ? "✓" : ""}
        </div>
        <span style={{ fontSize: 13 }}>I have read and agree to the Terms and Conditions</span>
      </label>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "0.5px solid rgba(0,0,0,0.25)",
  borderRadius: 8,
  fontSize: 14,
  background: "#fff",
  color: "#1a1a1a",
  outline: "none",
  fontFamily: "inherit",
};

export function ProfileContent() {
  const router = useRouter();
  const userCtx = useUser();
  const user = userCtx?.user ?? null;
  const loading = userCtx?.loading ?? true;
  const fetchUser = userCtx?.fetchUser ?? (async () => {});

  const [form, setForm] = useState<FormState>(initialData);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed form from fetched user profile, ported behavior
    setForm((prev) => ({
      ...prev,
      fullName: (user.fullname as string) || "",
      email: (user.email as string) || "",
      mobile: (user.phone as string) || (user.whatsapp as string) || "",
      targetYear: user.targetYear ? String(user.targetYear) : "",
      targetExams: user.targetExam ? [user.targetExam as string] : prev.targetExams,
    }));
  }, [user]);

  const showToast = (msg: string, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) => setForm((p) => ({ ...p, [key]: val }));

  const submitVerificationWithRetry = async (payload: FormData) => {
    try {
      return await axios.post(`${BASE_URL}/api/users/verification-profile`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      if ((err as { response?: { status?: number } })?.response?.status !== 401) {
        throw err;
      }

      await axios.post(`${BASE_URL}/api/users/refresh`, {}, { withCredentials: true });

      return axios.post(`${BASE_URL}/api/users/verification-profile`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  };

  const toggleExam = (exam: string) => {
    const exams = form.targetExams.includes(exam) ? form.targetExams.filter((e) => e !== exam) : [...form.targetExams, exam];

    const newForms = { ...form.applicationForms };
    Object.keys(newForms).forEach((k) => {
      if (!exams.includes(k)) delete newForms[k];
    });

    setForm((p) => ({ ...p, targetExams: exams, applicationForms: newForms }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName || !form.mobile || !form.email) {
      return showToast("Please fill all required personal details.");
    }
    if (!form.idFront || !form.idBack) {
      return showToast("Please upload ID proof (front & back).");
    }
    if (!form.passportPhoto) {
      return showToast("Please upload passport size photo.");
    }
    if (!form.livePhoto) {
      return showToast("Please take a live photo for verification.");
    }
    if (!form.signature) {
      return showToast("Please provide your signature.");
    }
    if (form.targetExams.length === 0) {
      return showToast("Please select at least one target exam.");
    }
    if (!form.address || !form.targetYear || !form.batchesEnrolled) {
      if (!form.targetYear) {
        return showToast("Target year is missing in your profile. Please re-login or contact support.");
      }
      return showToast("Please fill address and batch details.");
    }
    if (!form.termsAccepted) {
      return showToast("Please accept the Terms and Conditions.");
    }

    try {
      setSubmitting(true);
      const payload = new FormData();

      const idFrontFile = await compressImageFile(form.idFront, { maxWidth: 1800, maxHeight: 1800, quality: 0.75 });
      const idBackFile = await compressImageFile(form.idBack, { maxWidth: 1800, maxHeight: 1800, quality: 0.75 });
      const passportPhotoFile = await compressImageFile(form.passportPhoto, { maxWidth: 1200, maxHeight: 1200, quality: 0.72 });
      const marksheetFile = await compressImageFile(form.marksheet, { maxWidth: 1800, maxHeight: 1800, quality: 0.75 });

      payload.append("mobile", form.mobile);
      payload.append("address", form.address);
      payload.append("targetExam", form.targetExams[0] || "");
      payload.append("targetExams", JSON.stringify(form.targetExams));
      payload.append("targetYear", form.targetYear);
      payload.append("courseEnrolled", form.batchesEnrolled);
      payload.append("batchesEnrolled", form.batchesEnrolled);
      payload.append("fatherName", form.fatherName);
      payload.append("motherName", form.motherName);
      payload.append("parentsContact", form.parentsContact);
      payload.append("city", form.city);
      payload.append("state", form.state);
      payload.append("idType", form.idType);
      payload.append("livePhotoDataUrl", form.livePhoto);
      payload.append("signatureDataUrl", form.signature);
      payload.append("termsAccepted", String(form.termsAccepted));

      if (idFrontFile) payload.append("idFront", idFrontFile);
      if (idBackFile) payload.append("idBack", idBackFile);
      if (marksheetFile) payload.append("marksheet", marksheetFile);
      if (passportPhotoFile) payload.append("passportPhoto", passportPhotoFile);

      for (const [exam, file] of Object.entries(form.applicationForms)) {
        if (!file) continue;
        const optimizedFile = await compressImageFile(file, { maxWidth: 1800, maxHeight: 1800, quality: 0.75 });
        if (optimizedFile) payload.append(`applicationForm_${exam}`, optimizedFile);
      }

      await submitVerificationWithRetry(payload);

      await fetchUser();
      showToast("Profile submitted successfully. Your verification profile is now locked.", "success");
      setTimeout(() => router.push("/dashboard"), 900);
    } catch (err) {
      if ((err as { response?: { status?: number; data?: { message?: string } } })?.response?.status === 401) {
        showToast("Session expired. Please login again.");
        setTimeout(() => router.push("/login"), 700);
      } else {
        showToast(
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to submit verification profile"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !user) {
    return <div style={{ textAlign: "center", padding: 40 }}>Loading profile...</div>;
  }

  if (!user) {
    return <div style={{ textAlign: "center", padding: 40 }}>Please login first.</div>;
  }

  if (user.verificationProfileLocked || user.verificationProfileSubmitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f3", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>
          <div
            style={{
              background: "#fff",
              border: "0.5px solid rgba(0,0,0,0.12)",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Verification Profile Locked</h2>
            <p style={{ color: "#555", marginBottom: 16 }}>You have already submitted verification details once. Only admin can edit now.</p>
            <button type="button" style={outlineBtn} onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3", fontFamily: "sans-serif" }}>
      <section className="relative py-12 sm:py-20 md:py-22 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">Profile</span>{" "}
            <span className="text-white">Verification</span>
          </motion.h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path
              d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 48px" }}>
        <FormSection title="Personal Details" icon="👤" step={1}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Full Name <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Mobile <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Email <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
          </div>
        </FormSection>

        <FormSection title="ID Proof" icon="🪪" step={2}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              ID Type <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <select style={inputStyle} value={form.idType} onChange={(e) => set("idType", e.target.value)}>
              <option value="">Select ID type</option>
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FileUpload label="ID Front" onChange={(f) => set("idFront", f)} value={form.idFront} required />
            <FileUpload label="ID Back" onChange={(f) => set("idBack", f)} value={form.idBack} required />
          </div>
        </FormSection>

        <FormSection title="Academic Documents" icon="🎓" step={3}>
          <FileUpload
            label="Marksheet (Class X or XII)"
            onChange={(f) => set("marksheet", f)}
            value={form.marksheet}
            required
            accept="image/*,.pdf"
            hint="Upload your Class X or Class XII marksheet"
          />
        </FormSection>

        <FormSection title="Photos" icon="🖼️" step={4}>
          <FileUpload label="Passport Size Photo" onChange={(f) => set("passportPhoto", f)} value={form.passportPhoto} required hint="For result purpose" />
          <LivePhotoCapture onChange={(v) => set("livePhoto", v)} value={form.livePhoto} />
        </FormSection>

        <FormSection title="Signature" icon="✍️" step={5}>
          <SignaturePad onChange={(v) => set("signature", v)} value={form.signature} />
        </FormSection>

        <FormSection title="Target Exam" icon="🎯" step={6}>
          <div style={{ fontSize: 13, color: "#888" }}>Select exams you are preparing for (multiple allowed):</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {TARGET_EXAMS.map((exam) => {
              const active = form.targetExams.includes(exam);
              return (
                <div
                  key={exam}
                  onClick={() => toggleExam(exam)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: `0.5px solid ${active ? "#3b82f6" : "rgba(0,0,0,0.15)"}`,
                    background: active ? "#eff6ff" : "#fff",
                    color: active ? "#1e40af" : "#666",
                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 3,
                      flexShrink: 0,
                      border: `1.5px solid ${active ? "#3b82f6" : "#aaa"}`,
                      background: active ? "#3b82f6" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 10,
                    }}
                  >
                    {active ? "✓" : ""}
                  </div>
                  <span style={{ fontWeight: 500 }}>{exam}</span>
                </div>
              );
            })}
          </div>

          {form.targetExams.length > 0 && (
            <div
              style={{
                paddingLeft: 12,
                borderLeft: "2px solid rgba(59,130,246,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500 }}>Upload application forms:</div>
              {form.targetExams.map((exam) => (
                <FileUpload
                  key={exam}
                  label={`${exam} Application Form`}
                  onChange={(f) => set("applicationForms", { ...form.applicationForms, [exam]: f })}
                  value={form.applicationForms[exam] || null}
                  accept="image/*,.pdf"
                />
              ))}
            </div>
          )}
        </FormSection>

        <FormSection title="Family & Address" icon="👨‍👩‍👧" step={7}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Father&apos;s Name <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.fatherName} onChange={(e) => set("fatherName", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Mother&apos;s Name <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.motherName} onChange={(e) => set("motherName", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Parents&apos; Contact <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input style={inputStyle} value={form.parentsContact} onChange={(e) => set("parentsContact", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>City/Village</label>
              <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                State <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <select style={inputStyle} value={form.state} onChange={(e) => set("state", e.target.value)}>
                <option value="">Select state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              Full Address (for delivering Goodies) <span style={{ color: "#e53e3e" }}>*</span>
            </label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} value={form.address} onChange={(e) => set("address", e.target.value)} rows={3} />
          </div>
        </FormSection>

        <FormSection title="Batch Information" icon="📚" step={8}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Target Year</label>
              {form.targetYear ? (
                <input style={{ ...inputStyle, background: "#f8fafc", color: "#334155" }} value={form.targetYear} readOnly />
              ) : (
                <select style={inputStyle} value={form.targetYear} onChange={(e) => set("targetYear", e.target.value)}>
                  <option value="">Select year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Batches Enrolled</label>
              <select style={inputStyle} value={form.batchesEnrolled} onChange={(e) => set("batchesEnrolled", e.target.value)}>
                <option value="">Select batch</option>
                {BATCH_OPTIONS.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Terms & Conditions" icon="🛡️" step={9}>
          <TermsAndConditions accepted={form.termsAccepted} onChange={(v) => set("termsAccepted", v)} />
        </FormSection>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: 16 }}>
          <button
            type="submit"
            disabled={!form.termsAccepted || submitting}
            style={{
              background: form.termsAccepted && !submitting ? "linear-gradient(135deg,#e53e3e,#3b82f6)" : "rgba(0,0,0,0.2)",
              color: "#fff",
              border: "none",
              padding: "14px 40px",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 500,
              cursor: form.termsAccepted && !submitting ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            {submitting ? "Submitting..." : "Submit Profile ›"}
          </button>
        </div>
      </form>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
