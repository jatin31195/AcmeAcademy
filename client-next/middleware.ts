import { NextRequest, NextResponse } from "next/server";

// Replaces client/src/routes/ProtectedRoute.jsx. The original guard only
// ever checked `!!user` (populated by a client-side call to
// GET /api/users/me, which the backend verifies) — it never inspected the
// JWT itself client-side. This middleware preserves that exact trust
// boundary: it only checks for the *presence* of the accessToken cookie
// before allowing the request through, redirecting to /login otherwise. Full
// verification still happens exactly as before, server-side, on every
// authenticated API call the page then makes (AuthProvider's fetchUser ->
// GET /api/users/me). This also means the Edge runtime here never needs a
// JWT-verification library (jsonwebtoken is Node-only and incompatible with
// Edge; a presence-only check needs no such library at all).
//
// /dashboard is intentionally NOT in this list. In the original app,
// `<Route path="/dashboard" element={<Dashboard />} />` sat outside the
// `<Route element={<ProtectedRoute />}>` wrapper — unauthenticated visitors
// reached the page and saw its own in-page blurred overlay + login modal
// (still present in dashboard-content.tsx), never a hard redirect. Gating it
// here would change that page's access model, not just its verification
// mechanism. The gated set matches the original's actual wrapped routes:
// /acme-test/:testId, /acme-test-result/:testId/:attemptNumber?, /profile.
const PROTECTED_PATHS = ["/acme-test", "/acme-test-result", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!isProtected) return NextResponse.next();

  const hasAccessToken = request.cookies.has("accessToken");
  if (hasAccessToken) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/acme-test/:path*", "/acme-test-result/:path*", "/profile/:path*"],
};
