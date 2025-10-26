import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const QUESTIONS_PER_PAGE = 5;
const SUBQUESTIONS_PER_PAGE = 5;

const PracticeSets = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subPages, setSubPages] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSubjects, setExpandedSubjects] = useState({});

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        const data = res.data;

        const grouped = {};
        data.forEach((q) => {
          if (!grouped[q.subject]) grouped[q.subject] = {};
          if (!grouped[q.subject][q.topic]) grouped[q.subject][q.topic] = [];
          grouped[q.subject][q.topic].push(q);
        });

        const subjectsArray = Object.entries(grouped).map(([subjectName, topics]) => ({
          name: subjectName,
          topics: Object.entries(topics).map(([topicName, questions]) => ({
            name: topicName,
            questions,
          })),
        }));

        setSubjects(subjectsArray);

        if (subjectsArray.length) {
          const firstSubject = subjectsArray[0];
          const firstTopic = firstSubject.topics[0];
          setSelectedSubject(firstSubject.name);
          setSelectedTopic(firstTopic);
          setQuestions(firstTopic.questions);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      setCurrentPage(1);
      setSubPages({});
      setSelectedOptions({});
      setQuestions(selectedTopic.questions || []);
    }
  }, [selectedTopic]);

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE
  );

  const handleOptionClick = (questionId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
  };

  const getOptionStyle = (q, option) => {
    const selected = selectedOptions[q._id];
    if (!selected) return "";
    if (option === q.answer) return "border-success bg-success/10 font-medium";
    if (option === selected && option !== q.answer)
      return "border-destructive bg-destructive/10 font-medium";
    return "";
  };

  const toggleSubject = (subjectName) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  return (
    <>
    <div className="hero-gradient py-8 w-full"></div>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 relative flex">
      <div className="hero-gradient py-20"></div>
      
      <Button
        className="sm:hidden ml-4"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </Button>

      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

   
      <aside
        className={`
      w-64 border-r border-gray-200 p-4 bg-white shadow-lg rounded-r-xl
      overflow-y-auto
      fixed top-16 left-0 z-40 h-[calc(100vh-4rem)]
      transform transition-transform duration-300
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      sm:translate-x-0 sm:relative sm:h-auto
    `}
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
          <div key={subject.name} className="mb-3">
            <div
              className={`flex justify-between items-center cursor-pointer p-3 rounded-lg transition-all duration-200
                ${expandedSubjects[subject.name]
                  ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-inner"
                  : "hover:bg-gray-100"
                }`}
              onClick={() => toggleSubject(subject.name)}
            >
              <span className="font-semibold text-gray-800">{subject.name}</span>
              <span className="text-gray-500">
                {expandedSubjects[subject.name] ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </span>
            </div>

            {expandedSubjects[subject.name] && (
              <div className="mt-2 ml-4 space-y-2">
                {subject.topics.map((topic) => (
                  <div
                    key={topic.name}
                    className={`flex items-center justify-between p-2 pl-4 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedTopic?.name === topic.name
                        ? "bg-indigo-50 font-semibold text-indigo-700 shadow-md"
                        : "hover:bg-gray-50 hover:pl-5"
                      }`}
                    onClick={() => {
                      setSelectedSubject(subject.name);
                      setSelectedTopic(topic);
                      setSidebarOpen(false); 
                    }}
                  >
                    <span className="text-gray-700">{topic.name}</span>
                    <span className="text-gray-400 text-sm">{topic.questions.length}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ===== Main Content ===== */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

          {selectedTopic && (
            <>
              {/* ===== Search Box ===== */}
              <div className="relative mb-4 max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* ===== Questions Rendering ===== */}
              {paginatedQuestions.map((q, idx) => {
                const subPage = subPages[q._id] || 1;
                const subTotalPages = Math.ceil(
                  (q.subQuestions?.length || 0) / SUBQUESTIONS_PER_PAGE
                );
                const subPaginated = q.subQuestions?.slice(
                  (subPage - 1) * SUBQUESTIONS_PER_PAGE,
                  subPage * SUBQUESTIONS_PER_PAGE
                );

                return (
                  <Card key={q._id} className="border border-border mb-4 relative overflow-hidden">
  <CardContent className="space-y-3 pt-4 relative">
    
    <img
      src="/logo.png" 
      alt="Acme Logo"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-42 h-42 object-contain z-0"
    />

    {/* Main Question */}
    <div className="relative z-10">
      <p className="font-medium mb-2">
        Q{(currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1}. {q.question}
      </p>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <Badge variant="outline">{q.topic}</Badge>
      </div>
    </div>

    {/* Main Options */}
    {q.options?.length > 0 && (
      <div className="space-y-2 relative z-10">
        {q.options.map((opt, i) => (
          <div
            key={i}
            className={`p-3 rounded border border-border cursor-pointer transition-all ${getOptionStyle(
              q,
              opt
            )}`}
            onClick={() => handleOptionClick(q._id, opt)}
          >
            <span className="font-semibold mr-2">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt}
          </div>
        ))}
      </div>
    )}

    {/* Subquestions */}
    {subPaginated?.length > 0 && (
      <div className="mt-4 space-y-3 pt-4">
        {subPaginated.map((subQ, subIdx) => (
          <Card
            key={subIdx}
            className="border border-border bg-gray-50 relative overflow-hidden"
          >
            <CardContent className="space-y-2 relative pt-4">
            
              <img
                src="/logo.png"
                alt="Acme Logo"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-42 h-42 object-contain z-0"
              />

              <p className="font-medium relative z-10">
                {(subPage - 1) * SUBQUESTIONS_PER_PAGE + subIdx + 1}. {subQ.question}
              </p>

              {subQ.options?.length > 0 && (
                <div className="space-y-2 relative z-10">
                  {subQ.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded border border-border cursor-pointer transition-all ${getOptionStyle(
                        subQ,
                        opt
                      )}`}
                      onClick={() =>
                        handleOptionClick(
                          `${q._id}-${
                            (subPage - 1) * SUBQUESTIONS_PER_PAGE + subIdx
                          }`,
                          opt
                        )
                      }
                    >
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {subTotalPages > 1 && (
          <div className="flex justify-center gap-2 mt-2">
            <Button
              variant="outline"
              disabled={subPage === 1}
              onClick={() =>
                setSubPages((prev) => ({
                  ...prev,
                  [q._id]: subPage - 1,
                }))
              }
            >
              Previous
            </Button>
            <span className="px-3 py-1 bg-muted rounded">
              {subPage} / {subTotalPages}
            </span>
            <Button
              variant="outline"
              disabled={subPage === subTotalPages}
              onClick={() =>
                setSubPages((prev) => ({
                  ...prev,
                  [q._id]: subPage + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        )}
      </div>
    )}
  </CardContent>
</Card>

                );
              })}

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
            </>
          )}
        </motion.div>
      </main>
    </div>
    </>
  );
};

export default PracticeSets;
