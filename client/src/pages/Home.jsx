import { useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import ResultSection from "@/components/home/ResultSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FAQSection from "@/components/home/FAQSection";
import TrustSection from "@/components/home/TrustSection";
import TopVideos from "@/components/home/TopVideos";
import JSConfetti from "js-confetti";

import SEO from "../components/SEO";
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "ACME Academy",
  "url": "https://www.acmeacademy.in",
  "logo": "https://www.acmeacademy.in/logo.png",
  "sameAs": [
    "https://www.facebook.com/acmeacademynimcetmcacoaching",
    "https://www.youtube.com/c/ACMEACADEMYMCAENTRANCEACADEMYNIMCETAIMCA",
    "https://www.instagram.com/acmeacademy.in/",
    "https://t.me/Acme_Academy"
  ],
  "description": "India’s most trusted MCA Entrance Coaching platform for NIMCET, CUET, MAH-CET, and JMI exams.",
  "founder": {
    "@type": "Person",
    "name": "Kartikey Pandey",
    "jobTitle": "Director & Mathematics Mentor",
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "National Institute of Technology, Raipur"
    },
    "qualification": "MCA, Ph.D. Scholar",
    "image": "https://www.acmeacademy.in/assets/KP.png"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-8109977628",
      "contactType": "Customer Support",
      "availableLanguage": ["English", "Hindi"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "WhatsApp Support",
      "url": "https://wa.me/918109977628",
      "availableLanguage": ["English", "Hindi"]
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ACME Building, behind Kota Stadium, Kota, Raipur",
    "addressLocality": "Raipur",
    "addressRegion": "Chhattisgarh",
    "postalCode": "492010",
    "addressCountry": "IN"
  }
};



function Home() {
  useEffect(() => {
  const jsConfetti = new JSConfetti();

  setTimeout(() => {
    jsConfetti.addConfetti({
      confettiColors: [
        '#ff6b6b',
        '#f06595',
        '#fcc419',
        '#40c057',
        '#4dabf7',
        '#9775fa',
      ],
      confettiRadius: 6,
      confettiNumber: 250,
    });
  }, 800); // Delay to avoid navbar shift
}, []);

  return (
    <>
    <SEO
  title="ACME Academy – India’s Best MCA Coaching | NIMCET, CUET, MAH-CET, JMI"
  description="Join ACME Academy – India’s best and most trusted MCA entrance coaching platform for NIMCET, CUET, MAH-CET, and JAMIA. Explore test series, live classes, results, and free resources to ace your MCA entrance exams."
  url="https://www.acmeacademy.in/home"
  image="https://www.acmeacademy.in/assets/og-image.png"
  keywords="India’s best MCA coaching, NIMCET coaching, MCA entrance, CUET PG MCA, MAH-CET MCA, JMI MCA, ACME Academy, test series, online classes, MCA preparation"
  jsonLd={jsonLd}
/>

    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/40">
      <HeroSection />
       
      <TrustSection />
      <ResultSection />

    
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

export default Home;
