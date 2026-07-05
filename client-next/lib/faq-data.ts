// Extracted from client/src/components/home/FAQSection.jsx's hardcoded faqs
// array so both the Server page (FAQPage JSON-LD) and the Client
// FAQSection component (Accordion UI) can import the same plain data
// without a Server Component importing a value from a "use client" module.
export const faqs = [
  {
    q: "What is the duration of the NIMCET course?",
    a: "Our full-time NIMCET batch runs for 10 months, and the entire syllabus is covered twice with weekly mock tests and regular revisions.",
  },
  {
    q: "Is online coaching available?",
    a: "Yes, we offer live interactive online classes with recorded sessions, online doubt-solving, and affordable pricing for all students.",
  },
  {
    q: "Does ACME provide mock tests?",
    a: "Absolutely. We provide 1000+ mock tests, including live and pre-uploaded practice tests, along with detailed performance analytics.",
  },
  {
    q: "What is the batch strength?",
    a: "We proudly train over 700+ students every year while ensuring dedicated mentorship and consistent performance tracking.",
  },
  {
    q: "Did any ACME Academy student get AIR 1 in NIMCET 2026?",
    a: "Yes — ACME Academy student Kartik Sharma secured All India Rank 1 in NIMCET 2026, alongside AIR 39 and 100+ selections across NIT MCA programs this year.",
  },
];
