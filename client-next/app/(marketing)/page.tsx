import type { Metadata } from "next";
import Script from "next/script";
import HeroSection from "@/components/home/hero-section";
import ResultSection from "@/components/home/result-section";
import ExploreMoreSection from "@/components/home/explore-more-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CoursesSection from "@/components/home/courses-section";
import WhyChooseUs from "@/components/home/why-choose-us";
import HowItWorks from "@/components/home/how-it-works";
import FAQSection from "@/components/home/faq-section";
import { faqs } from "@/lib/faq-data";
import TrustSection from "@/components/home/trust-section";
import TopVideos from "@/components/home/top-videos";
import { SITE_NAME, OG_LOCALE, TWITTER_HANDLE } from "@/lib/seo";

// Ported from client/src/pages/Home.jsx. This file lives at
// app/(marketing)/page.tsx (not app/page.tsx) so it picks up the
// (marketing) route group's layout (Navbar/Footer/AuthProvider/Toast) —
// route groups don't add a URL segment, so this still maps to "/", the real
// canonical home route per the approved bare-"/" decision.
//
// The commented-out JSConfetti effect in the original (never active — its
// whole useEffect body was commented out, along with the unused `JSConfetti`
// import) is dead code and is not ported; omitting inert, never-executing
// code changes nothing about the rendered app.
export const metadata: Metadata = {
  title: "ACME Academy – India's Best MCA Coaching | NIMCET, CUET, MAH-CET, JMI",
  description:
    "Join ACME Academy – India's best and most trusted MCA entrance coaching platform for NIMCET, CUET, MAH-CET, and JAMIA. Explore test series, live classes, results, and free resources to ace your MCA entrance exams.",
  keywords:
    "India's best MCA coaching, NIMCET coaching, MCA entrance, CUET PG MCA, MAH-CET MCA, JMI MCA, ACME Academy, test series, online classes, MCA preparation",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "ACME Academy – India's Best MCA Coaching | NIMCET, CUET, MAH-CET, JMI",
    description:
      "Join ACME Academy – India's best and most trusted MCA entrance coaching platform for NIMCET, CUET, MAH-CET, and JAMIA. Explore test series, live classes, results, and free resources to ace your MCA entrance exams.",
    url: "/",
    siteName: SITE_NAME,
    locale: OG_LOCALE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ACME Academy – India's Best MCA Coaching | NIMCET, CUET, MAH-CET, JMI",
    description:
      "Join ACME Academy – India's best and most trusted MCA entrance coaching platform for NIMCET, CUET, MAH-CET, and JAMIA. Explore test series, live classes, results, and free resources to ace your MCA entrance exams.",
    site: TWITTER_HANDLE,
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ACME Academy",
  url: "https://www.acmeacademy.in",
  logo: "https://www.acmeacademy.in/logo.png",
  sameAs: [
    "https://www.facebook.com/acmeacademynimcetmcacoaching",
    "https://www.youtube.com/c/ACMEACADEMYMCAENTRANCEACADEMYNIMCETAIMCA",
    "https://www.instagram.com/acmeacademy.in/",
    "https://t.me/Acme_Academy",
  ],
  description: "India's most trusted MCA Entrance Coaching platform for NIMCET, CUET, MAH-CET, and JMI exams.",
  founder: {
    "@type": "Person",
    name: "Kartikey Pandey",
    jobTitle: "Director & Mathematics Mentor",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "National Institute of Technology, Raipur",
    },
    qualification: "MCA, Ph.D. Scholar",
    image: "https://www.acmeacademy.in/assets/KP.png",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8109977628",
      contactType: "Customer Support",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      contactType: "WhatsApp Support",
      url: "https://wa.me/918109977628",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "ACME Building, behind Kota Stadium, Kota, Raipur",
    addressLocality: "Raipur",
    addressRegion: "Chhattisgarh",
    postalCode: "492010",
    addressCountry: "IN",
  },
  mentions: [
    {
      "@type": "Article",
      headline: "Kartik Sharma Secures AIR 1 in NIMCET 2026",
      url: "https://www.acmeacademy.in/nimcet-2026-air-1-kartik-sharma",
      about: {
        "@type": "Person",
        name: "Kartik Sharma",
        award: "AIR 1, NIMCET 2026",
      },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <Script id="ld-home-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="ld-home-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/40">
        <HeroSection />
        <ResultSection />
        <ExploreMoreSection />
        <TrustSection />
        <TestimonialsSection />
        <CoursesSection />
        <WhyChooseUs />
        <TopVideos />
        <HowItWorks />
        <FAQSection />
      </div>
    </>
  );
}
