import type { Metadata } from "next";
import Script from "next/script";
import { ContactContent } from "@/components/contact/contact-content";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/pages/Contact.jsx. Note: the original SEO `image`
// prop was "https://www.acmeacademy.in/public/logo.png" — a pre-existing
// "/public/" typo in the source URL (public/ contents are served at root,
// not under /public/, so this image reference was already broken in
// production). Carried over verbatim rather than silently fixed, per the
// instruction to preserve existing behavior exactly.
export const metadata: Metadata = {
  title: "Contact ACME Academy | Best MCA Coaching in India (Raipur & Kanpur)",
  description:
    "Contact ACME Academy — India's #1 MCA Entrance Coaching Institute for NIMCET, CUET, and MAH-CET. Call +91-8109977628 or +91-9516001679, Email: info@acmeacademy.com. Visit our Raipur and Kanpur centers for admissions and free counselling.",
  keywords:
    "Contact ACME Academy, ACME Academy phone number, ACME Academy Raipur, ACME Academy Kanpur, MCA coaching contact, NIMCET help, CUET PG MCA admissions",
  alternates: {
    canonical: "/contact-acme-academy",
  },
  openGraph: {
    type: "website",
    title: "Contact ACME Academy | Best MCA Coaching in India (Raipur & Kanpur)",
    description:
      "Contact ACME Academy — India's #1 MCA Entrance Coaching Institute for NIMCET, CUET, and MAH-CET. Call +91-8109977628 or +91-9516001679, Email: info@acmeacademy.com. Visit our Raipur and Kanpur centers for admissions and free counselling.",
    url: "/contact-acme-academy",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/public/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ACME Academy | Best MCA Coaching in India (Raipur & Kanpur)",
    description:
      "Contact ACME Academy — India's #1 MCA Entrance Coaching Institute for NIMCET, CUET, and MAH-CET. Call +91-8109977628 or +91-9516001679, Email: info@acmeacademy.com. Visit our Raipur and Kanpur centers for admissions and free counselling.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/public/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "ACME Academy - Best MCA Coaching in India",
  description:
    "ACME Academy provides India's top-rated MCA entrance coaching for NIMCET, CUET-PG, MAH-CET, and other MCA exams. Learn online or offline with expert mentors and top results.",
  url: "https://www.acmeacademy.in/contact-acme-academy",
  publisher: {
    "@type": "EducationalOrganization",
    name: "ACME Academy",
    url: "https://www.acmeacademy.in",
    logo: "https://www.acmeacademy.in/logo.png",
  },
  mainEntity: {
    "@type": "Organization",
    name: "ACME Academy",
    alternateName: "ACME Academy India",
    url: "https://www.acmeacademy.in",
    logo: "https://www.acmeacademy.in/logo.png",
    sameAs: [
      "https://www.instagram.com/acmeacademy.in",
      "https://www.facebook.com/acmeacademy.in",
      "https://www.youtube.com/@acmeacademy",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-8109977628",
        contactType: "customer service",
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
    department: [
      {
        "@type": "EducationalOrganization",
        name: "ACME Academy -India's Best MCA Coaching",
        description:
          "India's best Online MCA coaching classes covering NIMCET, CUET-PG, and other MCA entrance exams. 100% live + recorded sessions.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "India",
          addressCountry: "IN",
        },
        courseMode: "Online",
        educationalLevel: "Postgraduate Entrance",
      },
      {
        "@type": "EducationalOrganization",
        name: "ACME Academy - Offline Centers",
        description: "Offline MCA coaching available at Raipur & Kanpur with in-class lectures, test series, and one-on-one mentoring.",
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
      },
    ],
    foundingDate: "2012",
    founder: {
      "@type": "Person",
      name: "ACME Academy Faculty Team",
    },
    slogan: "India's #1 MCA Coaching Institute (Online + Offline)",
  },
};

export default function ContactPage() {
  return (
    <>
      <Script
        id="ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactContent />
    </>
  );
}
