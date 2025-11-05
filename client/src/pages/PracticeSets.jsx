import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import MainContent from "@/components/PracticeSets/MainContent";
import "katex/dist/katex.min.css";
import { BASE_URL } from "../config";
import SEO from "../components/SEO";

const QUESTIONS_PER_PAGE = 5;

const PracticeSets = () => {
  const [practiceSets, setPracticeSets] = useState([]);
  const [selectedPracticeSet, setSelectedPracticeSet] = useState(null);

  const [practiceTopics, setPracticeTopics] = useState([]);
  const [selectedPracticeTopic, setSelectedPracticeTopic] = useState(null);

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTopics, setShowTopics] = useState(true);

  // 🟢 Fetch all Practice Sets
  useEffect(() => {
    const fetchPracticeSets = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/practice-set`);
        const sets = res.data?.data || [];
        setPracticeSets(sets);

        if (sets.length > 0) {
          setSelectedPracticeSet(sets[0]);
          await fetchPracticeTopics(sets[0]._id);
        }
      } catch (err) {
        console.error("❌ Error fetching practice sets:", err);
      }
    };
    fetchPracticeSets();
  }, []);

  // 🟡 Fetch Practice Topics (like Mathematics, Logical Reasoning)
  const fetchPracticeTopics = async (practiceSetId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/practice-topic/${practiceSetId}`);
      const data = res.data?.data || [];
      setPracticeTopics(data);
      setSelectedPracticeTopic(null);
      setTopics([]);
      setSelectedTopic(null);
      setQuestions([]);
    } catch (err) {
      console.error("❌ Error fetching practice topics:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟣 Fetch Topics inside a selected Practice Topic (like Probability, Number Series)
  const fetchTopics = async (practiceTopicId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/questions/practice-topic/${practiceTopicId}/topics`);
      const topicNames = res.data?.data || [];
      setTopics(topicNames);
      setExpandedSubjects((prev) => ({ ...prev, [practiceTopicId]: topicNames }));
    } catch (err) {
      console.error("❌ Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Fetch Questions for a selected Topic
  const fetchQuestions = async (practiceTopicId, topicName) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/questions/practice-topic/${practiceTopicId}/topics/${encodeURIComponent(topicName)}`
      );
      const data = res.data?.data || [];
      setQuestions(data);
      setSelectedTopic({ name: topicName });
      setCurrentPage(1);
      setSelectedOptions({});
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (id, option, correctAnswer, solutionText, solutionImage, solutionVideo) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: option }));
    setShowSolution((prev) => ({
      ...prev,
      [id]: { show: true, correctAnswer, solutionText, solutionImage, solutionVideo },
    }));
  };

  const getOptionStyle = (id, correctAnswer, option) => {
    const selected = selectedOptions[id];
    if (!selected) return "";
    if (option === correctAnswer) return "border-green-500 bg-green-100";
    if (option === selected && option !== correctAnswer)
      return "border-red-500 bg-red-100";
    return "";
  };

  const expandedQuestions = [];
  questions.forEach((q) => {
    expandedQuestions.push({ ...q, isSub: false });
    if (q.subQuestions?.length) {
      q.subQuestions.forEach((sub) =>
        expandedQuestions.push({ ...sub, isSub: true, parentId: q._id })
      );
    }
  });

  const totalPages = Math.ceil(expandedQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedExpanded = expandedQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  return (
    <>
      <SEO
      title="MCA Entrance Practice Sets | ACME Academy"
      description="Boost your MCA entrance exam preparation with interactive practice sets from ACME Academy. Includes Mathematics, Logical Reasoning, Computer Concepts, and more."
      url="https://www.acmeacademy.in/practice-sets"
      image="https://www.acmeacademy.in/assets/og-practice-sets.jpg"
      keywords="MCA Practice Sets, NIMCET Practice, CUET-PG Practice Questions, MCA Mock Tests, ACME Academy Practice, MCA Entrance Preparation"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "MCA Entrance Practice Sets",
        "description": "Interactive practice sets for MCA entrance preparation including Mathematics, Logical Reasoning, Computer Awareness, and English.",
        "url": "https://www.acmeacademy.in/practice-sets",
        "numberOfItems": practiceSets?.length || 0,
        "itemListElement": practiceSets?.slice(0, 10).map((set, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://www.acmeacademy.in/practice-set/${set._id}`,
          "name": set.title,
          "description": set.description || `${set.title} - MCA Practice Set by ACME Academy`,
          "publisher": {
            "@type": "Organization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in",
            "logo": "https://www.acmeacademy.in/logo.png"
          },
          "learningResourceType": "Practice Exercise",
          "educationalLevel": "Postgraduate Entrance",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ACME Academy",
            "sameAs": "https://www.acmeacademy.in"
          }
        })),
        "isPartOf": {
          "@type": "EducationalOccupationalProgram",
          "name": "MCA Entrance Coaching Program",
          "educationalCredentialAwarded": "MCA Admission",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in"
          }
        }
      }}
    />

      {/* HERO SECTION */}
      <section className="relative py-28 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-100">
            Practice Sets
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
            Choose your Practice Set, Category, and Topic to begin practicing.
          </p>

          {/* --- DROPDOWNS --- */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-2 sm:px-0 w-full max-w-4xl mx-auto">
            
            {/* 🟢 Practice Set Dropdown */}
            <div className="relative w-full sm:w-80 z-20">
              <select
                value={selectedPracticeSet?._id || ""}
                onChange={(e) => {
                  const set = practiceSets.find((s) => s._id === e.target.value);
                  setSelectedPracticeSet(set);
                  fetchPracticeTopics(set._id);
                }}
                className="w-full appearance-none bg-white text-gray-800 px-5 py-3 rounded-lg shadow-md 
                           focus:ring-4 focus:ring-blue-300 font-medium cursor-pointer 
                           border border-gray-200 sm:text-base text-sm transition-all duration-200"
              >
                <option value="">Select Practice Set</option>
                {practiceSets.map((set) => (
                  <option key={set._id} value={set._id}>
                    {set.title}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* 🟡 Practice Category Dropdown */}
            <div className="relative w-full sm:w-80 z-10">
              <select
                value={selectedPracticeTopic?._id || ""}
                onChange={(e) => {
                  const topic = practiceTopics.find((t) => t._id === e.target.value);
                  setSelectedPracticeTopic(topic);
                  fetchTopics(topic._id);
                }}
                disabled={!selectedPracticeSet}
                className="w-full appearance-none bg-white text-gray-800 px-5 py-3 rounded-lg shadow-md 
                           focus:ring-4 focus:ring-indigo-300 font-medium cursor-pointer 
                           border border-gray-200 sm:text-base text-sm 
                           transition-all duration-200 disabled:opacity-50"
              >
                <option value="">Select Practice Category</option>
                {practiceTopics.map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.title}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Decorative SVG Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1200 120"
            >
              <path
                d="M985.66 92.83C906.67 72 823.78 48.49 743.84 26.94 
                661.18 4.8 578.56-5.45 497.2 1.79 
                423.15 8.3 349.38 28.74 278.07 51.84 
                183.09 83.72 90.6 121.65 0 120v20h1200v-20
                c-80.3-1.6-160.39-26.5-214.34-47.17z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* --- TOPICS --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPracticeTopic?._id || "topics"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-6 py-10 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl -mt-15 relative z-10"
        >
          <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
            <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
              {selectedPracticeTopic ? `${selectedPracticeTopic.title} Topics` : "Topics"}
            </h2>

            <button
              onClick={() => setShowTopics((prev) => !prev)}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium"
            >
              {showTopics ? "Hide Topics" : "Show Topics"}
            </button>
          </div>

          {showTopics && (
            <>
              {expandedSubjects[selectedPracticeTopic?._id] ? (
                <div className="flex flex-wrap justify-center gap-3">
                  {expandedSubjects[selectedPracticeTopic._id].map((topic) => (
                    <motion.button
                      key={topic}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        fetchQuestions(selectedPracticeTopic._id, topic);
                        setShowTopics(false);
                      }}
                      className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedTopic?.name === topic
                          ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md border-transparent"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center">
                  Select a category to view topics
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* --- QUESTIONS --- */}
      <div className="flex-1 px-4 sm:px-8 py-10 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        <MainContent
          loading={loading}
          paginatedExpanded={paginatedExpanded}
          expandedQuestions={expandedQuestions}
          selectedSubject={selectedPracticeSet}
          selectedTopic={selectedTopic}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          handleOptionClick={handleOptionClick}
          getOptionStyle={getOptionStyle}
          showSolution={showSolution}
          QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
        />
      </div>
    </>
  );
};

export default PracticeSets;
