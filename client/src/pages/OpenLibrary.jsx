import { Link } from "react-router-dom";
import logo from "/logo.png";
import { BASE_URL } from "../config";
import { motion } from "framer-motion";
import SEO from "../components/SEO";

const OpenLibrary = () => {
  return (
    <><SEO
  title="Open Library | Free MCA Study Materials & Notes | ACME Academy"
  description="Access ACME Academy's free Open Library — get MCA entrance notes, free courses, and practice sets for NIMCET, CUET-PG, and other MCA exams. 100% free learning resources."
  url="https://www.acmeacademy.in/acme-academy-open-library"
  image="https://www.acmeacademy.in/assets/og-open-library.jpg"
  keywords="MCA free study materials, NIMCET notes, CUET-PG MCA free courses, MCA entrance preparation, ACME Open Library"
  jsonLd={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "ACME Academy Open Library",
    "description": "Free study resources, self-study courses, and practice sets for MCA entrance exams such as NIMCET, CUET-PG, MAH-CET, and others.",
    "url": "https://www.acmeacademy.in/acme-academy-open-library",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "ACME Academy",
      "url": "https://www.acmeacademy.in",
      "logo": "https://www.acmeacademy.in/logo.png"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Free MCA Learning Resources",
      "numberOfItems": 2,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Acme Free Self Study Courses",
          "description": "Access self-paced MCA courses with notes, theory, and guides from ACME Academy.",
          "url": "https://www.acmeacademy.in/acme-free-courses"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Practice Sets",
          "description": "Solve interactive MCA practice sets and previous year exam questions for NIMCET and other entrances.",
          "url": "https://www.acmeacademy.in/acme-practice-sets"
        }
      ]
    }
  }}
/>

    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">

      {/* Header */}
      <section className="relative py-16 sm:py-24 text-center overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              Open
            </span>{" "}
            <span className="text-white">Library</span>
          </motion.h1>
          <p className="font-semibold text-xl text-white/90 max-w-3xl mx-auto mb-12">
            Access our comprehensive collection of free study materials, books, notes, 
              <br/>
            and guides for all MCA entrance examinations.
          </p>
        </div>
        {/* subtle decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none"></div>
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

      {/* Special Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">

         
          <Link
            to="/acme-free-courses"
            className="relative group rounded-2xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col justify-between text-gray-800 border border-gray-200"
          >
  
            <img
              src={logo}
              alt="Logo"
              className="absolute top-4 right-4 w-24 opacity-10 pointer-events-none"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <h2 className="text-2xl font-bold tracking-tight">Acme Free Self Study Courses</h2>
              </div>
              <p className="text-gray-700/90 mb-6 leading-relaxed">
                Access all MCA self-study courses curated for you. Learn at your own pace with complete resources, notes, and guides.
              </p>
              <span className="font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                Explore Courses →
              </span>
            </div>
          </Link>

        
          <Link
            to="/acme-practice-sets"
            className="relative group rounded-2xl overflow-hidden shadow-lg bg-white/70 backdrop-blur-md hover:shadow-2xl transition-all duration-500 p-8 flex flex-col justify-between text-gray-800 border border-gray-200"
          >
    
            <img
              src={logo}
              alt="Logo"
              className="absolute top-4 right-4 w-24 opacity-10 pointer-events-none"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Logo" className="h-10 w-10" />
                <h2 className="text-2xl font-bold tracking-tight">Practice Sets</h2>
              </div>
              <p className="text-gray-700/90 mb-6 leading-relaxed">
                Test your knowledge with practice questions and sets from previous years’ MCA exams.
              </p>
              <span className="font-medium flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                Start Practicing →
              </span>
            </div>
          </Link>

        </div>
      </section>
    </div>
    </>
  );
};

export default OpenLibrary;
