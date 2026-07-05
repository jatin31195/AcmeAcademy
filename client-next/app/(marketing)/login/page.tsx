import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginContent } from "@/components/auth/login-content";

// Ported from client/src/pages/Login.jsx (<SEO noindex={true} />).
export const metadata: Metadata = {
  title: "Login - ACME Academy",
  description: "Access your ACME Academy account to take mock tests, track results, and continue your MCA entrance preparation journey.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
