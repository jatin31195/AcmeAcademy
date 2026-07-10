import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { DEFAULT_ROBOTS, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/index.html's Google Fonts <link> (Poppins + Inter).
// next/font self-hosts them (no external request, no render-blocking CDN
// link, no CLS) instead of the original <link rel="preconnect">+<link
// rel="stylesheet"> pair — this is the next/font/google swap called out in
// the migration blueprint's Performance Plan (SEO/CWV improvement, not a
// visual change: same families/weights are used).
// Named distinctly from Tailwind's --font-heading/--font-sans theme tokens
// (defined in globals.css) to avoid a same-name CSS-variable collision
// between next/font's html-scoped class and Tailwind's @theme :root block —
// globals.css wires the theme tokens to these explicitly instead.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Ported verbatim from client/index.html's <head> static tags.
// Canonical is "/" instead of "/home" per the approved decision to make
// bare "/" the real home route (blueprint §12, open question #1).
//
// No title `template` here: the original app's <SEO> component always set
// each page's <title> to a single, complete literal string (react-helmet-async
// just writes what it's given, no suffix ever appended). A Next.js title
// template would silently append " | ACME Academy" to every page's title —
// a real, visible parity regression (browser tab / search snippet) for every
// page that already has its own complete, brand-inclusive title. Only the
// root `default` (used when a page sets no title at all) is set here.
export const viewport: Viewport = {
  themeColor: "#0072CE",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.acmeacademy.in"),
  title: "ACME Academy - Best MCA Coaching in India | Online & Offline NIMCET Preparation",
  robots: DEFAULT_ROBOTS,
  description:
    "ACME Academy is India's top MCA entrance coaching institute for NIMCET, CUET-PG, MAH-CET, JMI, and VIT MCA exams. Join 2000+ successful students. Learn online or offline with expert mentors.",
  keywords: [
    "best MCA coaching in India",
    "NIMCET coaching",
    "online MCA classes",
    "offline MCA coaching",
    "CUET-PG MCA preparation",
    "MAH-CET MCA",
    "JMI MCA",
    "BIT MCA",
    "VIT MCA",
    "DU MCA",
    "ACME Test Portal",
    "ACME Academy Test Portal",
    "ACME online test portal",
    "ACME Academy online test series",
  ],
  authors: [{ name: "ACME Academy" }],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/icon.png",
    apple: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "ACME Academy - Best MCA Coaching in India (Online & Offline)",
    description:
      "Join ACME Academy, India's top-rated MCA coaching for NIMCET, CUET-PG & MAH-CET. 10+ years of excellence, 2000+ selections, and nationwide trust.",
    url: "/",
    siteName: "ACME Academy",
    // /assets/og-acme-home.jpg does not exist in client/public — pointed at
    // the real logo asset as an interim fix, ported as-is from index.html's
    // own inline comment explaining the same substitution.
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACME Academy - India's #1 MCA Entrance Coaching",
    description:
      "Learn from expert mentors for NIMCET, CUET-PG, MAH-CET & more. Join 2000+ successful MCA aspirants.",
    images: ["https://www.acmeacademy.in/logo.png"],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

// Ported verbatim from the two <script type="application/ld+json"> blocks
// in client/index.html. The SearchAction block index.html already omits
// (per its own inline comment — no /search route exists) stays omitted here.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ACME Academy",
  alternateName: "ACME Academy India",
  url: "https://www.acmeacademy.in",
  logo: "https://www.acmeacademy.in/logo.png",
  foundingDate: "2015",
  founder: {
    "@type": "Person",
    name: "Mr. Kartikey Pandey",
    alumniOf: "NIT Raipur",
    jobTitle: "Director & Mathematics Mentor",
  },
  sameAs: [
    "https://www.instagram.com/acmeacademy.in",
    "https://www.facebook.com/acmeacademy.in",
    "https://www.youtube.com/@acmeacademy",
  ],
  description:
    "India's top MCA coaching institute for NIMCET, CUET-PG, MAH-CET, JMI, and other MCA entrances. Learn online or offline with expert mentors and proven success.",
  slogan: "Your Gateway to MCA Success",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8109977628",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-9516001679",
      contactType: "admissions",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Near Fafadih Chowk",
      addressLocality: "Raipur",
      addressRegion: "Chhattisgarh",
      postalCode: "492001",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "ACME Academy (NIMCET MCA)",
      addressLocality: "Kanpur",
      addressRegion: "Uttar Pradesh",
      postalCode: "208016",
      addressCountry: "IN",
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ACME Academy",
  url: "https://www.acmeacademy.in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
