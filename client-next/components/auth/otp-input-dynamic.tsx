"use client";

import dynamic from "next/dynamic";

// otp-input-react touches `window` at module scope (not just inside its
// component render), which throws "window is not defined" during Next.js's
// server-side prerender pass — even inside a "use client" component, since
// Client Components still render once on the server for the initial HTML.
// ssr:false is only permitted inside a Client Component (see the same
// pattern used for the PDF viewer in Phase 2), hence this thin wrapper.
const OtpInput = dynamic(() => import("otp-input-react"), { ssr: false });

export default OtpInput;
