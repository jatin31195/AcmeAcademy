import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import QuestionDetails from "@/components/PracticeSets/QuestionDetail";
import { Helmet } from "react-helmet-async";
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
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/questions/subjects");
      const subjectsData = res.data;

      setSubjects(subjectsData);
      if (subjectsData.length > 0) {
        // Auto load first subject
        const firstSubject = subjectsData[0];
        setSelectedSubject(firstSubject);
        fetchTopics(firstSubject);
      }
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  fetchSubjects();
}, []);

const fetchTopics = async (subject) => {
  try {
    const res = await axios.get(
  `http://localhost:5000/api/questions/subjects/${encodeURIComponent(subject)}/topics`
);
const topicsData = Array.isArray(res.data) ? res.data : res.data.topics; 


    if (topicsData && topicsData.length > 0) {
      const firstTopic = topicsData[0];
      setSelectedTopic({ name: firstTopic });
      fetchQuestions(firstTopic);
    }

    setExpandedSubjects((prev) => ({
      ...prev,
      [subject]: topicsData,
    }));
  } catch (err) {
    console.error("Error fetching topics:", err);
  }
};


const fetchQuestions = async (topicName) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/questions/topic/${topicName}`);
    const questionsData = res.data;
    setQuestions(questionsData);
    setCurrentPage(1);
    setSelectedOptions({});
  } catch (err) {
    console.error("Error fetching questions:", err);
  }
};


  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  // 🔹 Flatten questions + subquestions
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

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectName]: !prev[subjectName],
    }));
  };

  return (
    <>
    <Helmet>
        <title>Practice Sets | ACME Academy</title>
        <meta name="description" content="Practice reasoning, maths, computer, English, JEE, NIMCET and more questions with detailed solutions at ACME Academy." />
        <meta name="keywords" content="reasoning questions, maths practice, computer aptitude, english grammar, nimcet preparation, jee practice sets" />
        <meta property="og:title" content="Practice Sets | ACME Academy" />
        <meta property="og:description" content="Daily practice sets for reasoning, maths, computer science, English, JEE, NIMCET, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/acme-practice-sets" />
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

          {subjects.map((subject) => (
  <div key={subject} className="mb-3">
    <div
      className={`flex justify-between items-center cursor-pointer p-3 rounded-lg transition-all duration-200
        ${
          expandedSubjects[subject]
            ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-inner"
            : "hover:bg-gray-100"
        }`}
      onClick={() => {
        if (!expandedSubjects[subject]) fetchTopics(subject);
        toggleSubject(subject);
      }}
    >
      <span className="font-semibold text-gray-800">{subject}</span>
      <span className="text-gray-500">
        {expandedSubjects[subject] ? <ChevronDown /> : <ChevronRight />}
      </span>
    </div>

    {expandedSubjects[subject] && Array.isArray(expandedSubjects[subject]) && (
      <div className="mt-2 ml-4 space-y-2">
        {expandedSubjects[subject].map((topic) => (
          <div
            key={topic}
            className={`flex items-center justify-between p-2 pl-4 rounded-lg cursor-pointer transition-all duration-200
              ${
                selectedTopic?.name === topic
                  ? "bg-indigo-50 font-semibold text-indigo-700 shadow-md"
                  : "hover:bg-gray-50 hover:pl-5"
              }`}
            onClick={() => {
              setSelectedSubject(subject);
              setSelectedTopic({ name: topic });
              fetchQuestions(topic);
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

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/library")}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>

            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Practice Sets
              </h1>
              {selectedSubject && selectedTopic && (
                <p className="text-muted-foreground text-sm">
                  Subject: {selectedSubject} | Topic: {selectedTopic.name}
                </p>
              )}
            </div>

            {/* Search */}
            <div className="relative mb-4 max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Questions */}
            {loading ? (
              <p className="text-center text-gray-500 mt-10">Loading...</p>
            ) : paginatedExpanded.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">
                No questions found.
              </p>
            ) : (
              paginatedExpanded.map((item, idx) => (
                <QuestionDetails
                  key={item._id || `${item.parentId}-${idx}`}
                  item={item}
                  idx={idx}
                  currentPage={currentPage}
                  QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
                  handleOptionClick={handleOptionClick}
                  getOptionStyle={getOptionStyle}
                  showSolution={showSolution}
                />
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 bg-muted rounded">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default PracticeSets;
