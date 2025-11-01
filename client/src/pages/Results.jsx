import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, Filter } from "lucide-react";
import { Helmet } from "react-helmet-async";
import PastGallery from "@/components/Results/PastGallery";
import logo from "/logo.png";

const Results = () => {
  const navigate = useNavigate();
  const { exam, year } = useParams();
  const [availableYears, setAvailableYears] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [results, setResults] = useState([]);
  const [combined, setCombined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(exam?.toUpperCase() || "NIMCET");
  const [selectedYear, setSelectedYear] = useState(year || "2025");

  const text = [
    "At ACME Academy, we don’t just teach — we mentor, inspire, and transform.",
    "Our structured NIMCET programs, expert faculty, and proven strategies empower students to unlock their full potential.",
    "From crystal-clear concept building to smart test analysis — ACME is where dreams turn into results.",
  ];

  useEffect(() => {
    if (selectedYear === "All") navigate(`/acme-academy-results`);
    else if (selectedYear === "PastGallery") navigate(`/acme-academy-results/past-gallery`);
    else navigate(`/acme-academy-results/${selectedExam.toLowerCase()}/${selectedYear}`);
  }, [selectedExam, selectedYear]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/results/exams");
        
        setAvailableExams(["MIXED", ...data]);
      } catch (err) {
        console.error("Error fetching exams:", err);
        setAvailableExams(["MIXED", "NIMCET"]); 
      }
    };
    fetchExams();
  }, []);

 useEffect(() => {
  const fetchYears = async () => {
    try {
      if (!selectedExam) return;

      if (selectedExam === "MIXED") {
        setAvailableYears(["All", "PastGallery"]);
        setSelectedYear("All");
        return;
      }

      const { data } = await axios.get(
        `http://localhost:5000/api/results/years/${selectedExam.toLowerCase()}`
      );

      // Filter valid numeric years (ignore null)
      const numericYears = (data || [])
        .filter((y) => typeof y === "number" && !isNaN(y))
        .sort((a, b) => b - a);

      const finalYears = ["All", ...numericYears, "PastGallery"];
      setAvailableYears(finalYears);

      // ✅ Only auto-select latest year if the current selectedYear is invalid
      if (
        !numericYears.includes(Number(selectedYear)) &&
        numericYears.length > 0
      ) {
        setSelectedYear(String(numericYears[0])); // Auto-select latest year
      }
    } catch (err) {
      console.error("Error fetching years:", err);
      setAvailableYears(["All", "PastGallery"]);
      setSelectedYear("All");
    }
  };

  fetchYears();
}, [selectedExam]);


const fetchResults = async () => {
  try {
    setLoading(true);

    // 🟢 1️⃣ MIXED EXAM MODE — show top from all exams (any year)
    if (selectedExam === "MIXED") {
      // Fetch all exams list dynamically
      const { data: exams } = await axios.get("http://localhost:5000/api/results/exams");

      // Fetch top few from each exam (latest years)
      const examUrls = exams.map(
        (exam) => `http://localhost:5000/api/results/top/${exam.toLowerCase()}`
      );

      const allExamResults = await Promise.all(
        examUrls.map((url) =>
          axios.get(url).then((res) => res.data).catch(() => [])
        )
      );

      // Flatten all & sort by rank or score
      const mixedCombined = allExamResults.flat().sort((a, b) => {
        if (a.rank && b.rank) return a.rank - b.rank;
        if (a.rank && !b.rank) return -1;
        if (!a.rank && b.rank) return 1;
        if (a.score && b.score) return b.score - a.score;
        return 0;
      });

      // Keep only top few (say 12)
      setResults(mixedCombined.slice(0, 12));

      // Sidebar remains combined (no reset)
      return;
    }

    // 🟠 2️⃣ ALL YEARS MODE (selected exam only)
    if (selectedYear === "All") {
      const { data: allYears } = await axios.get(
        `http://localhost:5000/api/results/years/${selectedExam.toLowerCase()}`
      );

      const validYears = (allYears || []).filter((y) => typeof y === "number");

      const yearUrls = validYears.map(
        (y) =>
          `http://localhost:5000/api/results/${selectedExam.toLowerCase()}/${y}`
      );

      const allYearResults = await Promise.all(
        yearUrls.map((url) =>
          axios.get(url).then((res) => res.data).catch(() => [])
        )
      );

      const combinedAllYears = allYearResults.flat().sort((a, b) => {
        if (a.rank && b.rank) return a.rank - b.rank;
        if (a.rank && !b.rank) return -1;
        if (!a.rank && b.rank) return 1;
        if (a.score && b.score) return b.score - a.score;
        return 0;
      });

      setResults(combinedAllYears.slice(0, 12));

      // ✅ Keep sidebar as-is (don’t modify)
      return;
    }

    // 🟣 3️⃣ PAST GALLERY MODE
    if (selectedYear === "PastGallery") {
      const { data } = await axios.get("http://localhost:5000/api/results/gallery/all");
      setResults(data || []);
      return;
    }

    // 🔵 4️⃣ SPECIFIC YEAR + EXAM MODE
    const mainUrl = `http://localhost:5000/api/results/${selectedExam.toLowerCase()}/${selectedYear}`;
    const { data: mainData } = await axios.get(mainUrl);
    setResults(mainData || []);

    // 🧠 Sidebar data (always fetched for consistency)
    const allExams = ["nimcet", "vit", "mahcet", "priority"];
    const otherExams = allExams.filter(
      (exam) => exam.toUpperCase() !== selectedExam.toUpperCase()
    );
    const years = [2025, 2024, 2023, 2022, 2021];

    const otherExamUrls = [];
    for (const exam of otherExams) {
      for (const year of years) {
        otherExamUrls.push(`http://localhost:5000/api/results/${exam}/${year}`);
      }
    }

    otherExamUrls.push("http://localhost:5000/api/results/combined");

    const otherResultsPromises = otherExamUrls.map((url) =>
      axios.get(url).then((res) => res.data).catch(() => [])
    );

    const allOtherData = await Promise.all(otherResultsPromises);
    const merged = allOtherData.flat();
    setCombined(merged || []);
  } catch (err) {
    console.error("Error fetching results:", err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchResults();
  }, [selectedExam, selectedYear]);

  const { mainResults } = useMemo(() => {
  const main = results.filter(
    (r) => (r.exam?.toUpperCase() || "") === selectedExam.toUpperCase()
  );

  // Sort logic:
  main.sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank;
    if (a.rank && !b.rank) return -1;
    if (!a.rank && b.rank) return 1;
    if (a.score && b.score) return b.score - a.score;
    return 0;
  });

  return { mainResults: main };
}, [results, selectedExam]);


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "ACME Academy",
    url: "https://your-website-domain.com",
    logo: "https://your-website-domain.com/logo.png",
    description:
      "ACME Academy is India’s leading institute for NIMCET preparation, producing top ranks every year.",
    department: {
      "@type": "EducationalOccupationalProgram",
      educationalCredentialAwarded: "MCA Entrance Coaching",
    },
    alumni: results.map((r) => ({
      "@type": "Person",
      name: r.name,
      award: `AIR ${r.rank} in ${r.exam?.toUpperCase() || "NIMCET"} ${r.year}`,
      image:
        r.photoUrl ||
        r.url ||
        "https://your-website-domain.com/assets/seo/profile-placeholder.jpg",
    })),
  };

 
const renderCard = (r) => (
  <motion.div
    key={r._id || r.url}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ y: -6, scale: 1.03 }}
    className="relative rounded-md shadow-md hover:shadow-2xl bg-white border border-gray-200 transition-all duration-500 overflow-hidden group"
  >
    <div className="relative h-44 sm:h-52 overflow-hidden">
      <img
        src={r.photoUrl || r.url}
        alt={`${r.name || r.eventName} ${r.exam || selectedExam} ${r.year} ${
          r.rank ? `Rank ${r.rank}` : r.score ? `Score ${r.score}` : ""
        } - ACME Academy Topper`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>

    <div className="p-4 text-center">
      <h3 className="text-base font-semibold text-purple-600 group-hover:text-indigo-700 transition">
        {r.name || r.eventName}
      </h3>

      {r.rank ? (
        <p className="font-semibold text-sm text-gray-600 mt-1">
          <span className="font-medium text-indigo-600">AIR {r.rank}</span> |{" "}
          {r.exam?.toUpperCase()} {r.year}
        </p>
      ) : r.score ? (
        <p className="font-semibold text-sm text-gray-600 mt-1">
          <span className="font-medium text-green-600">Score: {r.score}</span> |{" "}
          {r.exam?.toUpperCase()} {r.year}
        </p>
      ) : (
        <p className="font-semibold text-sm text-gray-600 mt-1">
          {r.exam?.toUpperCase()} {r.year}
        </p>
      )}
    </div>
  </motion.div>
);



const renderSidebarCard = (r) => (
  <motion.div
    key={r._id || r.url}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    whileHover={{ scale: 1.02 }}
    className="relative rounded-md shadow-md bg-white border border-gray-200 overflow-hidden group
               max-w-[260px] sm:max-w-[300px] lg:max-w-full mx-auto"
  >
    <div className="relative overflow-hidden">
      <img
        src={r.photoUrl || r.url}
        alt={r.name || r.eventName}
        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
        style={{
          objectFit: "contain",
          display: "block",
          backgroundColor: "#fff",
        }}
      />
    </div>
  </motion.div>
);


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
      <Helmet>
        <title>
          {`${selectedExam || "NIMCET"} ${selectedYear} Top Results | ACME Academy – Best MCA Coaching`}
        </title>
        <meta
          name="description"
          content={`See ACME Academy's top ${selectedExam} ${selectedYear} results and AIR ranks. India’s most trusted NIMCET coaching with proven selections every year.`}
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-25 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold text-white drop-shadow-2xl"
          >
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 text-transparent bg-clip-text">
              Our
            </span>{" "}
            <span className="text-white">Top Achievers</span>
          </motion.h1>

          <div className="mt-8 max-w-3xl mx-auto space-y-5 text-white/90">
            {text.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.6 }}
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-10 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center text-gray-900 mb-10 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Trophy className="inline-block w-8 h-8 text-yellow-500 mb-1 mr-2" />
            Our Top Performers
            <img
              src={logo}
              alt="ACME Logo"
              className="absolute top-0 right-0 w-24 opacity-10 pointer-events-none"
            />
          </motion.h2>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row flex-wrap gap-4 mb-10 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="h-5 w-5" />
              <span>Filter by:</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition w-36 sm:w-auto"
>
  {availableYears.map((year) => (
    <option key={year} value={year}>
      {year === "All"
        ? "All Years"
        : year === "PastGallery"
        ? "Past Gallery"
        : year}
    </option>
  ))}
</select>


             <select
  value={selectedExam}
  onChange={(e) => setSelectedExam(e.target.value)}
  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition w-36 sm:w-auto"
>
  {availableExams.map((examName) => (
    <option key={examName} value={examName}>
      {examName}
    </option>
  ))}
</select>

            </div>
          </motion.div>

         
         {loading ? (
  <div className="flex justify-center items-center py-16">
    <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
    <p className="ml-3 text-gray-600 text-lg">Loading results...</p>
  </div>
) : selectedYear === "PastGallery" ? (
  <PastGallery galleryData={results} />
) : (
  <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.2fr] gap-8">
   
    <div>
      {/* 1️⃣ MAIN RESULTS FIRST */}
      {mainResults.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {mainResults.map(renderCard)}
        </motion.div>
      ) : (
        <p className="text-center text-gray-500 italic py-10">
          
        </p>
      )}

   
      {(() => {
       
       const combinedFiltered = Array.from(
  new Map(
    combined
      .filter((r) => r && r.photoUrl)
      .map((r) => [r.photoUrl, r]) 
  ).values()
).filter((r) => r.exam?.toLowerCase() !== selectedExam.toLowerCase());


        if (combinedFiltered.length === 0) return null;

        const half = Math.ceil(combinedFiltered.length / 2);
        const combinedMain = combinedFiltered.slice(0, half);

        return (
          <>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mt-8 mb-4">
              Acme मतलब Selection की GUARANTEE
            </h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {combinedMain.map(renderCard)}
            </motion.div>
          </>
        );
      })()}
    </div>

    {/* 🟣 SIDEBAR */}
    <aside className="space-y-5 lg:w-auto w-[85%] sm:w-[60%] mx-auto lg:mx-0 lg:sticky lg:top-20 self-start h-fit">
      {(() => {
        const combinedFiltered = combined
          .filter(
            (r) =>
              r.photoType === "combined" ||
              r.exam?.toLowerCase() !== selectedExam.toLowerCase()
          )
          .filter(
            (r, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t._id?.toString() === r._id?.toString() ||
                  t.photoUrl === r.photoUrl
              )
          );

       // Split the data
        const half = Math.ceil(combinedFiltered.length / 2);
        let combinedSidebar = combinedFiltered.slice(half);

        //Apply sorting for non-combined exams
        combinedSidebar = combinedSidebar.sort((a, b) => {
          if (a.photoType === "combined" || b.photoType === "combined") return 0;
          if (a.rank && b.rank) return a.rank - b.rank;
          if (a.rank && !b.rank) return -1;
          if (!a.rank && b.rank) return 1;
          if (a.score && b.score) return b.score - a.score;

          return 0;
        });


        if (combinedSidebar.length === 0)
          return (
            <p className="text-center text-gray-500 text-sm italic">
              No additional results to show.
            </p>
          );

        return combinedSidebar.map(renderSidebarCard);
      })()}
    </aside>
  </div>
)}

        </div>
      </section>

     
      <section className="py-20 bg-white border-t border-gray-200 text-center">
        <motion.div
          className="max-w-3xl mx-auto px-6 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-gray-900 leading-tight">
            Dream. Prepare. Achieve.
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            Join{" "}
            <span className="font-semibold text-indigo-600">ACME Academy</span> — where
            discipline meets excellence, and preparation turns into performance.
          </p>
          <Button
            className="mt-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold text-lg px-10 py-3 rounded-full shadow-lg hover:shadow-pink-400/30 transition-transform hover:scale-105"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Join ACME Now
          </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default Results;
