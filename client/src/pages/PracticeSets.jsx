import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import MainContent from "@/components/PracticeSets/MainContent";
import MathMainContent from "@/components/PracticeSets/MathMainContent";
import "katex/dist/katex.min.css";
import { BASE_URL } from "../config";

const QUESTIONS_PER_PAGE = 5;

const PracticeSets = () => {
  const [subjects, setSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTopics, setShowTopics] = useState(true);

  
  useEffect(() => {
    const initFetch = async () => {
      try {
        const [generalRes, mathRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/questions/subjects`),
          axios.get(`${BASE_URL}/api/math-question/subjects`),
        ]);

        const generalSubjects = ((generalRes.data?.data || generalRes.data) || []).map((s) => ({
          name: s,
          type: "general",
        }));

        const mathSubjects = ((mathRes.data?.data || mathRes.data) || []).map((s) => ({
          name: s,
          type: "math",
        }));

        const allSubjectsList = [...generalSubjects, ...mathSubjects];
        if (!allSubjectsList.length) return;

        setSubjects(allSubjectsList);
        setAllSubjects(allSubjectsList);

        const firstSubject = allSubjectsList[0];
        setSelectedSubject(firstSubject);
        await fetchTopics(firstSubject);
      } catch (err) {
        console.error("❌ Error fetching initial data:", err);
      }
    };
    initFetch();
  }, []);

  
  const fetchTopics = async (subjectObj) => {
    if (!subjectObj) return;
    const { name, type } = subjectObj;
    try {
      const baseUrl =
        type === "math"
          ? `${BASE_URL}/api/math-question`
          : `${BASE_URL}/api/questions`;

      const res = await axios.get(
        `${baseUrl}/subjects/${encodeURIComponent(name)}/topics`
      );

      let topicsData = [];
      if (Array.isArray(res.data)) topicsData = res.data;
      else if (res.data?.topics) topicsData = res.data.topics;
      else if (res.data?.data) topicsData = res.data.data;

      if (topicsData && topicsData.length > 0) {
        setExpandedSubjects((prev) => ({ ...prev, [name]: topicsData }));
        const firstTopic = topicsData[0];
        setSelectedTopic({ name: firstTopic });
        await fetchQuestions(subjectObj, firstTopic);
      }
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  
  const fetchQuestions = async (subjectObj, topicName) => {
    try {
      setLoading(true);
      const baseUrl =
        subjectObj.type === "math"
          ? `${BASE_URL}/api/math-question`
          : `${BASE_URL}/api/questions`;

      const res = await axios.get(
        `${baseUrl}/subjects/${encodeURIComponent(subjectObj.name)}/topics/${encodeURIComponent(
          topicName
        )}`
      );

      let questionsData = [];
      if (Array.isArray(res.data)) {
        questionsData = res.data;
      } else if (res.data?.data) {
        questionsData = res.data.data;
      }

      setQuestions(questionsData);
      setCurrentPage(1);
      setSelectedOptions({});
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSubjects(allSubjects);
    } else {
      const filtered = allSubjects.filter((s) =>
        s.name.toLowerCase().includes(term.toLowerCase())
      );
      setSubjects(filtered);
    }
  };


  const filteredQuestions = questions.filter((q) =>
    q.question?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const expandedQuestions = [];
  filteredQuestions.forEach((q) => {
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

  const handleOptionClick = (
    id,
    option,
    correctAnswer,
    solutionText,
    solutionImage,
    solutionVideo
  ) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: option }));
    setShowSolution((prev) => ({
      ...prev,
      [id]: {
        show: true,
        correctAnswer,
        solutionText,
        solutionImage,
        solutionVideo,
      },
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

  return (
    <>
      <Helmet>
        <title>Practice Sets | ACME Academy</title>
      </Helmet>


      <section className="relative py-28 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-100">
            Practice Sets
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
            Choose your subject and topic to start practicing. Learn, test, and
            master concepts with detailed solutions.
          </p>

       
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-2 sm:px-0 w-full max-w-3xl mx-auto">
 
  <div className="relative w-full sm:w-80 z-20">
    <select
      value={selectedSubject?.name || ""}
      onChange={(e) => {
        const subj = allSubjects.find((s) => s.name === e.target.value);
        setSelectedSubject(subj);
        fetchTopics(subj);
      }}
      className="w-full appearance-none bg-white text-gray-800 px-5 py-3 rounded-lg shadow-md 
                 focus:ring-4 focus:ring-blue-300 font-medium cursor-pointer 
                 border border-gray-200 sm:text-base text-sm 
                 transition-all duration-200"
    >
      <option value="">Select a Subject</option>
      {subjects.map((subjectObj) => (
        <option key={subjectObj.name} value={subjectObj.name}>
          {subjectObj.name}
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

  
  <div className="relative w-full sm:w-80">
    <input
      type="text"
      placeholder="Search subjects..."
      onChange={(e) => handleSearch(e.target.value)}
      className="w-full bg-white/90 text-gray-800 px-5 py-3 rounded-lg shadow-md 
                 focus:ring-4 focus:ring-indigo-300 placeholder-gray-500 
                 border border-gray-200 sm:text-base text-sm 
                 transition-all duration-200"
    />
  </div>
</div>


          
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
        </div>
      </section>

      {/* --- TOPICS --- */}
<AnimatePresence mode="wait">
  <motion.div
    key={selectedSubject?.name || "topics"}
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.3 }}
    className="max-w-6xl mx-auto px-6 py-10 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl -mt-10 relative z-10"
  >
    <div className="flex flex-col items-center justify-between gap-4 mb-6 sm:flex-row">
      <h2 className="text-2xl font-bold text-gray-800 text-center sm:text-left">
        {selectedSubject ? `${selectedSubject.name} Topics` : "Topics"}
      </h2>

      {/* ✅ Toggle Button */}
      <button
        onClick={() => setShowTopics((prev) => !prev)}
        className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium"
      >
        {showTopics ? "Hide Topics" : "Show Topics"}
      </button>
    </div>

    {/* ✅ Topics Section (Collapsible) */}
    {showTopics && (
      <>
        {expandedSubjects[selectedSubject?.name] ? (
          <div className="flex flex-wrap justify-center gap-3">
            {expandedSubjects[selectedSubject.name].map((topic) => (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedTopic({ name: topic });
                  fetchQuestions(selectedSubject, topic);
                  setShowTopics(false); // ✅ Auto-hide after selecting
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
            Select a subject to view topics
          </p>
        )}
      </>
    )}
  </motion.div>
</AnimatePresence>


      {/* --- QUESTIONS --- */}
      <div className="flex-1 px-4 sm:px-8 py-10 bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        {selectedSubject?.type === "math" ? (
          <MathMainContent
            loading={loading}
            paginatedExpanded={paginatedExpanded}
            expandedQuestions={expandedQuestions}
            selectedSubject={selectedSubject}
            selectedTopic={selectedTopic}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            handleOptionClick={handleOptionClick}
            getOptionStyle={getOptionStyle}
            showSolution={showSolution}
            QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
          />
        ) : (
          <MainContent
            loading={loading}
            paginatedExpanded={paginatedExpanded}
            expandedQuestions={expandedQuestions}
            selectedSubject={selectedSubject}
            selectedTopic={selectedTopic}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            handleOptionClick={handleOptionClick}
            getOptionStyle={getOptionStyle}
            showSolution={showSolution}
            QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
          />
        )}
      </div>
    </>
  );
};

export default PracticeSets;
