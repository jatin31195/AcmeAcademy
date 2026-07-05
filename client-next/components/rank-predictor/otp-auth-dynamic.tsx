"use client";

import dynamic from "next/dynamic";

// This page's Client Component chain imports lib/rank-predictor/firebase.ts
// at module scope (top-level `await fetch(...)` + `initializeApp`), which
// must never run during SSR. next/dynamic's `ssr:false` is only honored
// from within a "use client" boundary, matching the same pattern already
// used for otp-input-dynamic.tsx (Signup) and the PDF viewer in Phase 2.
const OtpAuthContent = dynamic(() => import("@/components/rank-predictor/otp-auth-content"), { ssr: false });

export default OtpAuthContent;
