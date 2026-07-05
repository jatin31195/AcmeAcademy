import Link from "next/link";
import Image from "next/image";

// Branded 404 used when notFound() is called from within any page inside
// the (marketing) route group (e.g. Questions/[slug] on a missing/removed
// question) — rendered inside this group's layout, so Navbar/Footer still
// show, unlike Next's bare default 404. The original app had no distinct
// themed "not found" screen for this case (it showed an infinite "Loading..."
// message instead), so there is no exact original UI to replicate here; this
// is a minimal branded page replacing only the bare Next.js default.
export default function MarketingNotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        padding: "48px 32px",
        textAlign: "center",
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
