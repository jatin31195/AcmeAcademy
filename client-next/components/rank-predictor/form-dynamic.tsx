"use client";

import dynamic from "next/dynamic";

// Same rationale as otp-auth-dynamic.tsx: this page's Client Component chain
// imports lib/rank-predictor/firebase.ts at module scope, which must never
// run during SSR.
const FormContent = dynamic(() => import("@/components/rank-predictor/form-content"), { ssr: false });

export default FormContent;
