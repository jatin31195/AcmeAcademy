import type { Metadata } from "next";
import Script from "next/script";
import { AboutContent } from "@/components/about/about-content";

// Ported from client/src/pages/About.jsx. See about-content.tsx for why the
// visual body is one Client Component rather than split into many Motion
// Wrapper islands.
export const metadata: Metadata = {
  title: "About ACME Academy | Best MCA Coaching in India (Online & Offline)",
  description:
    "ACME Academy is India's most trusted MCA entrance coaching institute for NIMCET, CUET-PG, and MAH-CET. With 2000+ selections, 10+ years of experience, and nationwide students, ACME leads MCA preparation both online and offline.",
  keywords:
    "about ACME Academy, best MCA coaching in India, top NIMCET coaching, MCA entrance preparation, best online MCA coaching, best offline MCA institute, ACME Academy India",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    title: "About ACME Academy | Best MCA Coaching in India (Online & Offline)",
    description:
      "ACME Academy is India's most trusted MCA entrance coaching institute for NIMCET, CUET-PG, and MAH-CET. With 2000+ selections, 10+ years of experience, and nationwide students, ACME leads MCA preparation both online and offline.",
    url: "/about",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About ACME Academy | Best MCA Coaching in India (Online & Offline)",
    description:
      "ACME Academy is India's most trusted MCA entrance coaching institute for NIMCET, CUET-PG, and MAH-CET. With 2000+ selections, 10+ years of experience, and nationwide students, ACME leads MCA preparation both online and offline.",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About ACME Academy",
  description:
    "Learn about ACME Academy — India's leading MCA entrance coaching institute offering online and offline programs for NIMCET, CUET-PG, MAH-CET, JMI, and more.",
  url: "https://www.acmeacademy.in/about",
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
    foundingDate: "2015",
    founder: {
      "@type": "Person",
      name: "Dr. Kartikey Pandey",
      jobTitle: "Director & Mathematics Mentor",
      alumniOf: "NIT Raipur",
      sameAs: "https://www.linkedin.com/in/kartikey-pandey",
    },
    description:
      "ACME Academy offers India's best online and offline MCA coaching with 10+ years of experience and 2000+ selections in NITs, DU, JNU, BHU, JMI, and HCU.",
    slogan: "Transforming Aspirations into Achievements",
    sameAs: [
      "https://www.instagram.com/acmeacademy.in",
      "https://www.facebook.com/acmeacademy.in",
      "https://www.youtube.com/@acmeacademy",
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
    memberOf: {
      "@type": "EducationalOccupationalProgram",
      name: "MCA Entrance Preparation (NIMCET, CUET-PG, MAH-CET, JMI)",
      educationalCredentialAwarded: "MCA Admission",
      provider: {
        "@type": "EducationalOrganization",
        name: "ACME Academy",
      },
    },
  },
};

export default function AboutPage() {
  return (
    <>
      <Script
        id="ld-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
