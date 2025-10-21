import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Info, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import InstructionsPage from "../components/Test/InstructionsPage";
import { useAuth } from "@/AuthContext";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const Test = () => {
  const { user } = useAuth();
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [currentSection, setCurrentSection] = useState("");

  // Fetch test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tests/${testId}`, { withCredentials: true });
        setTestData(res.data);
        setCurrentSection(res.data.sections?.[0]?.title || "");
        setTimeLeft(res.data.totalDurationMinutes * 60);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTest();
  }, [testId]);

  // Timer
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft]);

  // Mark visited
  useEffect(() => {
    if (testStarted && testData) {
      const currentQ = testData.questions[currentQuestion];
      setQuestionStatus(prev => ({
        ...prev,
        [currentQ._id]: {
          ...prev[currentQ._id],
          visited: true,
          answered: answers[currentQ._id] !== undefined,
          markedForReview: prev[currentQ._id]?.markedForReview || false,
        },
      }));
    }
  }, [currentQuestion, testStarted, testData, answers]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Switching tabs is not allowed. Your test will be submitted.");
        handleSubmit();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fullscreen
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  // Handlers
  const handleAnswer = (questionId, selectedOption) => {
  setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  setQuestionStatus(prev => ({
    ...prev,
    [questionId]: { ...prev[questionId], answered: true, visited: true },
  }));
};


  const handleMarkForReviewAndNext = () => {
    const currentQ = testData.questions[currentQuestion];
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ._id]: {
        ...prev[currentQ._id],
        markedForReview: true,
        visited: true,
        answered: answers[currentQ._id] !== undefined,
      },
    }));
    handleSaveAndNext();
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
  question: questionId,
  answer, 
}));
      console.log("Submitting answers:", formattedAnswers);
      await axios.post(
        `http://localhost:5000/api/tests/${testId}/submit`,
        { answers: formattedAnswers, questionStatus },
        { withCredentials: true }
      );

      navigate(`/acme-test-result/${testId}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const formatTime = s => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")} min`;
  };

  const getQuestionStatusColor = id => {
    const status = questionStatus[id];
    const answered = answers[id] !== undefined;

    if (!status?.visited) return "bg-white border-2 border-gray-300 text-gray-700";
    if (answered && status?.markedForReview) return "bg-purple-600 text-white";
    if (status?.markedForReview) return "bg-purple-400 text-white";
    if (answered) return "bg-green-500 text-white";
    return "bg-red-500 text-white";
  };

  const statusCounts = {
  notAnswered: Object.values(questionStatus).filter(q => q.visited && !q.answered).length,
  marked: Object.values(questionStatus).filter(q => q.markedForReview).length,
  answered: Object.values(questionStatus).filter(q => q.answered).length,
  notVisited: Object.values(questionStatus).filter(q => !q.visited).length,
  answeredAndMarked: Object.values(questionStatus).filter(q => q.answered && q.markedForReview).length,
};

  if (!testData) return <div>Loading...</div>;
  if (!testStarted)
    return (
      <InstructionsPage
        test={testData}
        instructionsRead={instructionsRead}
        setInstructionsRead={setInstructionsRead}
        onStart={() => setTestStarted(true)}
        username={user?.username || "Student"}
      />
    );

  const currentQ = testData.questions[currentQuestion];
  const questions = testData.questions;
  const renderWithMath = text => {
    if (!text) return "No question text";
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1).trim();
        return <InlineMath key={i} math={math} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
      <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap">
        <h1 className="text-base font-medium">
          Probability (APT-2603) | ACME Practice Test
        </h1>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <button className="flex items-center gap-2 text-cyan-500 text-sm hover:underline">
            <Info className="h-4 w-4" /> Test Instructions
          </button>
          <div className="text-sm font-medium">
            Time Left:{" "}
            <span className={timeLeft < 300 ? "text-red-500" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Section Navigator */}
      <div className="border-b flex items-center justify-between px-4 py-2 bg-cyan-500 text-white">
        <ChevronLeft className="h-5 w-5 cursor-pointer" />
        <span className="text-sm font-medium">{currentSection}</span>
        <ChevronRight className="h-5 w-5 cursor-pointer" />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden gap-4">
        {/* Main Question Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center justify-between flex-wrap">
            <h2 className="text-lg font-semibold">
              Question-{currentQuestion + 1}
            </h2>
            <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
              <span className="text-sm">
                Marking Scheme:{" "}
                <span className="text-green-600 font-semibold">+4</span>{" "}
                <span className="text-red-600 font-semibold">-1</span>
              </span>
              <Button
                variant={
                  questionStatus[currentQ._id]?.markedForReview
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={handleMarkForReviewAndNext}
                className={
                  questionStatus[currentQ._id]?.markedForReview
                    ? "bg-cyan-500 hover:bg-cyan-600"
                    : "border-cyan-500 text-cyan-500 hover:bg-cyan-50"
                }
              >
                👁️{" "}
                {questionStatus[currentQ._id]?.markedForReview
                  ? "Marked"
                  : "Mark for Review"}
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 text-gray-800 leading-relaxed">
  {renderWithMath(currentQ.question || currentQ.text)}
</div>

         {/* Options */}
<div className="space-y-2">
{currentQ.options.map((option, index) => (
  <label
    key={index}
    className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
      answers[currentQ._id] === option
        ? "bg-green-100 border border-green-500"
        : "bg-white border hover:bg-gray-50"
    }`}
  >
    <input
      type="radio"
      name={`question-${currentQ._id}`}
      checked={answers[currentQ._id] === option}
      onChange={() => handleAnswer(currentQ._id, option)}
      className="mt-1"
    />
    <span className="flex-1 text-gray-700">
      {renderWithMath(option)}
    </span>
  </label>
))}

</div>

        </div>

        {/* Right Sidebar */}
   <div className="w-full md:w-80 border-l bg-gray-50 p-4 md:p-6 overflow-auto flex-shrink-0">
  {/* 🧑 User Info */}
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
      {user?.username?.[0]?.toUpperCase() || "U"}
    </div>
    <span className="font-semibold text-sm">{user?.username || "Student"}</span>
  </div>

  {/* 🟢 Question Status Legend (2 per row) */}
  <h4 className="font-semibold text-sm mb-2 text-gray-700">Question Status</h4>
  <div className="grid grid-cols-2 gap-3 text-xs mb-6">
    {/* Not Visited */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300"></div>
        <span>Not Visited</span>
      </div>
      <span className="font-bold text-gray-700">{statusCounts.notVisited || 0}</span>
    </div>

    {/* Not Answered */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-red-500"></div>
        <span>Not Answered</span>
      </div>
      <span className="font-bold text-gray-700">{statusCounts.notAnswered || 0}</span>
    </div>

    {/* Answered */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-green-500"></div>
        <span>Answered</span>
      </div>
      <span className="font-bold text-gray-700">{statusCounts.answered || 0}</span>
    </div>

    {/* Marked for Review */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-purple-400"></div>
        <span>Marked for Review</span>
      </div>
      <span className="font-bold text-gray-700">{statusCounts.marked || 0}</span>
    </div>

    {/* Answered & Marked for Review */}
    <div className="flex items-center justify-between col-span-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rotate-45 bg-purple-600"></div>
        <span>Answered & Marked</span>
      </div>
      <span className="font-bold text-gray-700">{statusCounts.answeredAndMarked || 0}</span>
    </div>
  </div>

  {/* 🧮 Question Palette */}
  <h3 className="font-bold text-center mb-3">{currentSection}</h3>
  <div className="grid grid-cols-5 gap-2 mb-6">
    {questions.map((q, index) => (
      <button
        key={q._id}
        onClick={() =>
          setCurrentQuestion(questions.findIndex((x) => x._id === q._id))
        }
        className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold transition-all duration-200 ${getQuestionStatusColor(q._id)}`}
      >
        {index + 1}
      </button>
    ))}
  </div>
</div>

      </div>

      {/* Footer */}
     {/* Footer */}
<div className="border-t px-4 py-4 flex items-center justify-between flex-wrap gap-2">
  <Button
    variant="outline"
    onClick={() =>
      currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
    }
    disabled={currentQuestion === 0}
    className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
  >
    <ChevronLeft className="mr-2 h-4 w-4" />
    Previous
  </Button>

  <div className="flex gap-2 flex-wrap">
  

    <Button
      variant="outline"
      onClick={handleSaveAndNext}
      className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
    >
      Save & Next <ChevronRight className="ml-2 h-4 w-4" />
    </Button>

    <Button
      onClick={handleSubmit}
      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 md:px-8"
    >
      Submit Test
    </Button>
  </div>
</div>

    </div>
  );
};

export default Test;
