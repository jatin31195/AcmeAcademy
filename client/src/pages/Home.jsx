import HeroSection from "@/components/home/HeroSection";
import ResultSection from "@/components/home/ResultSection";
import ExploreMoreSection from "@/components/home/ExploreMoreSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FAQSection from "@/components/home/FAQSection";
import TrustSection from "@/components/home/TrustSection";
import TopVideos from "@/components/home/TopVideos";
import AppDownloadSection from "@/components/home/AppDownloadSection";
import { createAcmeJsonLd } from "@/lib/seo-constants";

import SEO from "../components/SEO";

const jsonLd = createAcmeJsonLd("EducationalOrganization");

function Home() {
  return (
    <>
    <SEO
  title="ACME Academy – India’s Best MCA Coaching | NIMCET, CUET, MAH-CET, JMI"
  description="Join ACME Academy – India’s best and most trusted MCA entrance coaching platform for NIMCET, CUET, MAH-CET, and JAMIA. Explore test series, live classes, results, and free resources to ace your MCA entrance exams."
  url="https://www.acmeacademy.in/home"
  image="https://www.acmeacademy.in/logo.png"
  keywords="India’s best MCA coaching, NIMCET coaching, MCA entrance, CUET PG MCA, MAH-CET MCA, JMI MCA, ACME Academy, test series, online classes, MCA preparation"
  jsonLd={jsonLd}
/>

    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/40">
      <HeroSection />
      <AppDownloadSection />

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

export default Home;
