import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

// Ported from client/src/pages/Dashboard.jsx, which had no <SEO> component
// (private/authenticated page) — noindex added as the same gap-fix category
// used for other private pages.
export const metadata: Metadata = {
  title: "Dashboard - ACME Academy",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
