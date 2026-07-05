"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ScoreCheckerFloat from "@/components/score-checker-float";

const RP_BASE = "/nimcet-rank-predictor";

// Ported from client/src/App.jsx's hideNavbar/hideFooter/hideFloat booleans.
// The original computed these once per render from `useLocation()` and used
// them to conditionally render <Navbar>/<Footer>/<ScoreCheckerFloat> as
// siblings of the router output — a single global chrome-visibility rule,
// not per-route layouts. Reproduced here as a pathname-aware Client wrapper
// so every route (Phase 1/2 marketing/content pages, and this phase's
// Login/Signup/Dashboard/Test/Profile/ScoreChecker/RankPredictor pages) gets
// identical chrome behavior to the original, all from one shared layout.
//
// Bare "/" is intentionally NOT in hideNavbar here (unlike the original),
// per the already-approved decision that "/" is now the real Home route
// (the original's "/" entry only ever existed because "/" was a dead
// redirect-only path).
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const hideNavbar =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/acme-courses" ||
    pathname.startsWith("/acme-player") ||
    pathname.startsWith("/acme-test");

  const hideFooter = hideNavbar || pathname === "/acme-practice-sets" || pathname === "/score-checker";

  const hideFloat =
    pathname === "/score-checker" || pathname.startsWith("/acme-player") || pathname.startsWith("/acme-test") || pathname.startsWith(RP_BASE);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {!hideFloat && <ScoreCheckerFloat />}
      {!hideFooter && <Footer />}
    </>
  );
}
