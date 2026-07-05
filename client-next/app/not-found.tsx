import Link from "next/link";
import Image from "next/image";

// Root-level 404 for genuinely unmatched URLs (no matching route segment at
// all, so this renders above the (marketing) route group and has no
// Navbar/Footer available). The original React app's catch-all
// (`<Route path="*" element={<Navigate to="/home" replace />} />`) silently
// redirected any unknown URL to Home — a soft-404 that never surfaced a real
// 404 status. Rather than reproducing that redirect (an already-identified,
// intentional SEO improvement to keep), this renders a real branded 404 page
// instead of Next's bare default, per the Phase 4 follow-up fix scope.
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "32px",
        textAlign: "center",
        background: "linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)",
      }}
    >
      <Image src="/logo.png" alt="ACME Academy" width={842} height={711} style={{ height: "64px", width: "64px", objectFit: "contain" }} />
      <div>
        <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Page Not Found</h1>
        <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
      </div>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "12px 28px",
          borderRadius: "999px",
          background: "linear-gradient(90deg,#2563eb,#4f46e5)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "15px",
          textDecoration: "none",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
