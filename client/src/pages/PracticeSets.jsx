import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const QUESTIONS_PER_PAGE = 5;

const PracticeSets = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
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
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200">
        <section className="relative py-8 overflow-hidden hero-gradient">
  </section>
      
      <aside className="w-64 border-r border-border p-4 sticky top-24 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Subjects</h2>
        {subjects.map((subject) => (
          <div key={subject.name}>
            <div
              className="flex justify-between items-center cursor-pointer p-2 hover:bg-muted rounded"
              onClick={() => toggleSubject(subject.name)}
            >
              <span>{subject.name}</span>
              {expandedSubjects[subject.name] ? <ChevronDown /> : <ChevronRight />}
            </div>
            {expandedSubjects[subject.name] &&
              subject.topics.map((topic) => (
                <div
                  key={topic.name}
                  className={`ml-4 cursor-pointer p-1 hover:bg-muted rounded ${
                    selectedTopic?.name === topic.name ? "bg-muted/20 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setSelectedSubject(subject.name);
                    setSelectedTopic(topic);
                  }}
                >
                  {topic.name} ({topic.questions.length})
                </div>
              ))}
          </div>
        ))}
      </aside>

      <main className="flex-1 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-4xl font-bold gradient-text mb-2">Practice Sets</h1>
            {selectedSubject && selectedTopic && (
              <p className="text-muted-foreground text-sm">
                Subject: {selectedSubject} | Topic: {selectedTopic.name}
              </p>
            )}
          </div>

          {selectedTopic && (
            <>
              <div className="relative mb-4 max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {paginatedQuestions.map((q, idx) => (
                <Card key={q._id} className="border border-border mb-4">
                  <CardContent className="space-y-3 pt-4">
                    <div>
                      <p className="font-medium mb-2">
                        Q{(currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1}. {q.question}
                      </p>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="outline">{q.topic}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded border border-border cursor-pointer transition-all ${getOptionStyle(
                            q,
                            opt
                          )}`}
                          onClick={() => handleOptionClick(q._id, opt)}
                        >
                          <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    {selectedOptions[q._id] && (
                      <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-success mt-2">
                        <h4 className="font-semibold mb-2 text-success">Answer: {q.answer}</h4>
                        <p className="text-sm text-muted-foreground">{q.solutionText}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

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
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PracticeSets;
