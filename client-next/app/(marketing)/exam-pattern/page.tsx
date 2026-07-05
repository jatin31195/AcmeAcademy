import type { Metadata } from "next";
import Script from "next/script";
import { Reveal } from "@/components/motion/reveal";
import { ExamPatternTabs } from "@/components/exam-pattern/exam-pattern-tabs";

// Ported from client/src/pages/ExamPattern.jsx. Server shell (hero +
// metadata + JSON-LD) + the <ExamPatternTabs> Client Island for the
// interactive tab-switching section — see that file's comment for why.
export const metadata: Metadata = {
  title: "MCA Exam Patterns 2025 | NIMCET, CUET-PG, MAH-CET, JMI & VIT MCA",
  description:
    "Explore detailed MCA exam patterns for NIMCET, CUET-PG, MAH-CET, JMI, and VIT MCA. Know the syllabus, marking scheme, duration, and question structure for 2025 entrance exams.",
  keywords:
    "MCA exam pattern 2025, NIMCET syllabus, CUET PG MCA, MAH CET MCA paper pattern, JMI MCA entrance, VIT MCA exam structure, ACME Academy",
  alternates: {
    canonical: "/exam-pattern",
  },
  openGraph: {
    type: "website",
    title: "MCA Exam Patterns 2025 | NIMCET, CUET-PG, MAH-CET, JMI & VIT MCA",
    description:
      "Explore detailed MCA exam patterns for NIMCET, CUET-PG, MAH-CET, JMI, and VIT MCA. Know the syllabus, marking scheme, duration, and question structure for 2025 entrance exams.",
    url: "/exam-pattern",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCA Exam Patterns 2025 | NIMCET, CUET-PG, MAH-CET, JMI & VIT MCA",
    description:
      "Explore detailed MCA exam patterns for NIMCET, CUET-PG, MAH-CET, JMI, and VIT MCA. Know the syllabus, marking scheme, duration, and question structure for 2025 entrance exams.",
    images: ["https://www.acmeacademy.in/logo.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "MCA Exam Patterns 2025",
  description:
    "Compare exam patterns, syllabus, marking schemes, and question distribution for top MCA entrance exams including NIMCET, CUET-PG, MAH-CET, JMI MCA, and VIT MCA.",
  url: "https://www.acmeacademy.in/mca-exam-patterns",
  publisher: {
    "@type": "EducationalOrganization",
    name: "ACME Academy",
    url: "https://www.acmeacademy.in",
    logo: "https://www.acmeacademy.in/logo.png",
  },
  mainEntity: {
    "@type": "ItemList",
    name: "MCA Exam Patterns List",
    numberOfItems: 5,
    itemListElement: [
      {
        "@type": "EducationalOccupationalProgram",
        position: 1,
        name: "NIMCET Exam Pattern 2025",
        educationalCredentialAwarded: "MCA Admission (National Institutes of Technology)",
        description:
          "NIMCET 2025 paper pattern with 120 MCQs on Mathematics, Analytical Ability, Logical Reasoning, Computer Awareness, and English.",
        timeOfDay: "Morning",
        educationalLevel: "Postgraduate Entrance",
        inLanguage: "en",
        provider: { "@type": "EducationalOrganization", name: "NITs (National Institutes of Technology)" },
        url: "https://www.acmeacademy.in/mca-exam-patterns#nimcet",
      },
      {
        "@type": "EducationalOccupationalProgram",
        position: 2,
        name: "CUET-PG MCA Exam Pattern 2025",
        educationalCredentialAwarded: "MCA Admission (Central Universities)",
        description: "CUET-PG MCA pattern with 75 MCQs covering Computer Science, Reasoning, Mathematics, and Analytical Aptitude.",
        provider: { "@type": "EducationalOrganization", name: "NTA (National Testing Agency)" },
        url: "https://www.acmeacademy.in/mca-exam-patterns#cuet-pg",
      },
      {
        "@type": "EducationalOccupationalProgram",
        position: 3,
        name: "MAH-CET MCA Exam Pattern 2025",
        educationalCredentialAwarded: "MCA Admission (Maharashtra State)",
        description: "MAH-CET MCA paper with 100 questions from Logical Reasoning, Quantitative Aptitude, English, and Computer Concepts.",
        provider: { "@type": "EducationalOrganization", name: "State Common Entrance Test Cell, Maharashtra" },
        url: "https://www.acmeacademy.in/mca-exam-patterns#mah-cet",
      },
      {
        "@type": "EducationalOccupationalProgram",
        position: 4,
        name: "JMI MCA Entrance Exam Pattern 2025",
        educationalCredentialAwarded: "MCA Admission (Jamia Millia Islamia University)",
        description: "JMI MCA pattern — 100 MCQs on Mathematics, Reasoning, Computer Awareness, and General English.",
        provider: { "@type": "EducationalOrganization", name: "Jamia Millia Islamia" },
        url: "https://www.acmeacademy.in/mca-exam-patterns#jmi",
      },
      {
        "@type": "EducationalOccupationalProgram",
        position: 5,
        name: "VIT MCA Exam Pattern 2025",
        educationalCredentialAwarded: "MCA Admission (VIT University)",
        description: "VIT MCA entrance with 100 MCQs covering Analytical Ability, Computer Awareness, Mathematics, and Logical Reasoning.",
        provider: { "@type": "EducationalOrganization", name: "VIT University" },
        url: "https://www.acmeacademy.in/mca-exam-patterns#vit",
      },
    ],
  },
};

export default function ExamPatternPage() {
  return (
    <>
      <Script
        id="ld-exam-pattern"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-30 text-center overflow-hidden hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"></div>
          <Reveal initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
                Explore
              </span>{" "}
              <span className="text-white">MCA Exam Patterns</span>
            </h1>
          </Reveal>
          <p className="text-gray-800 text-lg sm:text-xl  max-w-3xl mx-auto">
            Get detailed <b>structure, syllabus, and marking scheme</b> for every top MCA entrance exam — all in
            one place.
          </p>

          {/* Animated Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
            >
              <path
                d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 661.18 4.8 578.56-5.45 497.2 1.79 423.15 8.3 349.38 28.74 278.07 51.84 183.09 83.72 90.6 121.65 0 120v20h1200v-20c-80.3-1.6-160.39-26.5-214.34-47.17z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        <ExamPatternTabs />
      </div>
    </>
  );
}
