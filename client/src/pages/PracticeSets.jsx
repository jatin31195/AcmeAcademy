import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {ArrowLeft,ChevronDown,ChevronRight,Search,Menu,X,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MainContent from "@/components/PracticeSets/MainContent";
import MathMainContent from "@/components/PracticeSets/MathMainContent";
import "katex/dist/katex.min.css";
const QUESTIONS_PER_PAGE = 5;

const PracticeSets = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [loading, setLoading] = useState(false);

 
 useEffect(() => {
  const initFetch = async () => {
    try {
      const [generalRes, mathRes] = await Promise.all([
  axios.get("http://localhost:5000/api/questions/subjects"),
  axios.get("http://localhost:5000/api/math-question/subjects")
]);

const generalSubjects = ((generalRes.data?.data || generalRes.data) || []).map((s) => ({
  name: s,
  type: "general",
}));

const mathSubjects = ((mathRes.data?.data || mathRes.data) || []).map((s) => ({
  name: s,
  type: "math",
}));

const allSubjects = [...generalSubjects, ...mathSubjects];
if (!allSubjects.length) return;

setSubjects(allSubjects);
const firstSubject = allSubjects[0];
setSelectedSubject(firstSubject);

await fetchTopics(firstSubject);

    } catch (err) {
      console.error("❌ Error fetching initial data:", err);
    }
  };

  initFetch();
}, []);


const fetchTopics = async (subjectObj) => {
  const { name, type } = subjectObj;
  try {
    const baseUrl =
      type === "math"
        ? "http://localhost:5000/api/math-question"
        : "http://localhost:5000/api/questions";

    const res = await axios.get(
      `${baseUrl}/subjects/${encodeURIComponent(name)}/topics`
    );

    // ✅ Handle both response shapes
    let topicsData = [];
    if (Array.isArray(res.data)) {
      topicsData = res.data;
    } else if (res.data?.topics) {
      topicsData = res.data.topics;
    } else if (res.data?.data) {
      topicsData = res.data.data;
    }

    if (topicsData && topicsData.length > 0) {
  const orderedTopics = [...topicsData]; 
  const firstTopic = orderedTopics[0];
  setSelectedTopic({ name: firstTopic });
  setExpandedSubjects((prev) => ({ ...prev, [name]: orderedTopics }));
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
        ? "http://localhost:5000/api/math-question"
        : "http://localhost:5000/api/questions";

    const res = await axios.get(
      `${baseUrl}/subjects/${encodeURIComponent(subjectObj.name)}/topics/${encodeURIComponent(topicName)}`
    );

    // ✅ Normalize possible responses
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




  const filteredQuestions = questions.filter((q) =>
    q.question?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

 
  const expandedQuestions = [];
  filteredQuestions.forEach((q) => {
    expandedQuestions.push({ ...q, isSub: false, parentId: null });
    if (q.subQuestions?.length) {
      q.subQuestions.forEach((sub, idx) => {
        expandedQuestions.push({
          ...sub,
          isSub: true,
          parentId: q._id,
          parentQuestion: q.question,
          parentTopic: q.topic,
        });
      });
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
        solutionText: solutionText || "",
        solutionImage: solutionImage || "",
        solutionVideo: solutionVideo || "",
      },
    }));
  };

  const getOptionStyle = (id, correctAnswer, option) => {
    const selected = selectedOptions[id];
    if (!selected) return "";
    if (option === correctAnswer)
      return "border-green-500 bg-green-100 font-medium";
    if (option === selected && option !== correctAnswer)
      return "border-red-500 bg-red-100 font-medium";
    return "";
  };

 const toggleSubject = async (subjectObj) => {
  const isExpanded = expandedSubjects[subjectObj.name];
  if (isExpanded) {
    setExpandedSubjects((prev) => ({ ...prev, [subjectObj.name]: false }));
  } else {
    await fetchTopics(subjectObj);
  }
};


  return (
    <>
      <Helmet>
        <title>Practice Sets | ACME Academy</title>
        <meta
          name="description"
          content="Practice reasoning, maths, computer, English, JEE, NIMCET and more questions with detailed solutions at ACME Academy."
        />
      </Helmet>

      <div className="hero-gradient py-8 w-full"></div>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 relative flex">
        <Button className="sm:hidden ml-4" onClick={() => setSidebarOpen(true)}>
          <Menu />
        </Button>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-30 z-30 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`w-64 border-r border-gray-200 p-4 bg-white shadow-lg rounded-r-xl
          overflow-y-auto fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:relative sm:h-auto`}
        >
          <div className="flex justify-between items-center mb-6 sm:mb-0">
            <h2 className="text-xl font-extrabold gradient-text">Subjects</h2>
            <Button
              variant="ghost"
              className="sm:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X />
            </Button>
          </div>

          {subjects.map((subjectObj) => (
  <div key={subjectObj.name} className="mb-3">
    <div
      className={`flex justify-between items-center cursor-pointer p-3 rounded-lg transition-all duration-200 ${
        expandedSubjects[subjectObj.name]
          ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-inner"
          : "hover:bg-gray-100"
      }`}
      onClick={() => toggleSubject(subjectObj)}
    >
      <span className="font-semibold text-gray-800">
        {subjectObj.name}
        {subjectObj.type === "math" && (
          <span className="text-xs ml-2 text-blue-500"></span>
        )}
      </span>
      <span className="text-gray-500">
        {expandedSubjects[subjectObj.name] ? (
          <ChevronDown />
        ) : (
          <ChevronRight />
        )}
      </span>
    </div>

    {Array.isArray(expandedSubjects[subjectObj.name]) && (
      <div className="mt-2 ml-4 space-y-2">
        {expandedSubjects[subjectObj.name].map((topic) => (
          <div
            key={topic}
            className={`flex items-center justify-between p-2 pl-4 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedTopic?.name === topic &&
              selectedSubject?.name === subjectObj.name
                ? "bg-indigo-50 font-semibold text-indigo-700 shadow-md"
                : "hover:bg-gray-50 hover:pl-5"
            }`}
            onClick={() => {
              setSelectedSubject(subjectObj);
              setSelectedTopic({ name: topic });
              fetchQuestions(subjectObj, topic);
              setSidebarOpen(false);
            }}
          >
            <span className="text-gray-700">{topic}</span>
          </div>
        ))}
      </div>
    )}
  </div>
))}

        </aside>

        
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
