"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RP_BASE, RP_AUTH_KEY } from "@/lib/rank-predictor/constants";

// Ported from client/src/features/rank-predictor/ProtectedRoute.jsx.
//
// Route guard for the NIMCET Rank Predictor flow. Auth here is the
// phone-OTP session (sessionStorage "rp_auth"), which is separate from the
// main site login — a visitor verifies their phone via OTP to access the
// form/report, without needing an ACME account.
//
// The original guard ran synchronously during render (`sessionStorage` is
// always available in a pure CSR app) and returned a `<Navigate>` redirect
// element directly. sessionStorage doesn't exist during Next.js's SSR pass,
// so the check instead runs in an effect on mount; children are withheld
// until the check completes, matching the original's "never show protected
// content without a valid session" guarantee.
export default function RankProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const authData = sessionStorage.getItem(RP_AUTH_KEY);

    if (!authData) {
      router.replace(RP_BASE);
      return;
    }

    try {
      const { phone, expiry } = JSON.parse(authData);
      if (!phone || new Date().getTime() > expiry) {
        sessionStorage.removeItem(RP_AUTH_KEY);
        router.replace(RP_BASE);
        return;
      }
    } catch {
      sessionStorage.removeItem(RP_AUTH_KEY);
      router.replace(RP_BASE);
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- session-guard check on mount, ported behavior
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;

  return children;
}
