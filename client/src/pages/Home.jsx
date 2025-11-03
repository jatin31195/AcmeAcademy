import HeroSection from "@/components/home/HeroSection";
import ResultSection from "@/components/home/ResultSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import FAQSection from "@/components/home/FAQSection";
import TrustSection from "@/components/home/TrustSection";
import TopVideos from "@/components/home/TopVideos";
import FreeCounselling from "@/components/home/FreeCounselling";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/40">
      <HeroSection />
        <FreeCounselling />
      <TrustSection />
      <ResultSection />

    
          <TestimonialsSection />
       
       
      
      <CoursesSection />
      <WhyChooseUs />
      <TopVideos />
    
      <HowItWorks />
      <FAQSection />
    </div>
  );
}

export default Home;
