import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import InstructionsPage from "../components/Test/InstructionsPage";
import TimerHeader from "../components/Test/TimerHeader";
import QuestionCard from "../components/Test/QuestionCard";
import QuestionPalette from "../components/Test/QuestionPalette";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/AuthContext";

const Test = () => {
  const { user } = useAuth();
  const studentId = user?._id;
  const { testId } = useParams();
  const navigate = useNavigate();

  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState("");

 
  useEffect(() => {
  const fetchTest = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tests/${testId}`,{
         withCredentials: true,
      });
      setTestData(res.data);

      // Safe handling
      const secs = res.data.sections || [];
      setSections(secs.map(s => s.title));
      setCurrentSection(secs.length > 0 ? secs[0].title : "");
      setTimeLeft(res.data.durationMinutes * 60);
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

  // Mark question visited
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
  }, [currentQuestion, testStarted, testData]);

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

  // Answer handlers
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], answered: true, visited: true },
    }));
  };

  const handleMarkForReview = () => {
    const currentQ = testData.questions[currentQuestion];
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ._id]: { ...prev[currentQ._id], markedForReview: !prev[currentQ._id]?.markedForReview, visited: true },
    }));
  };

  const handleClearResponse = () => {
    const currentQ = testData.questions[currentQuestion];
    const newAnswers = { ...answers };
    delete newAnswers[currentQ._id];
    setAnswers(newAnswers);
    setQuestionStatus(prev => ({
      ...prev,
      [currentQ._id]: { ...prev[currentQ._id], answered: false, visited: true },
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < testData.questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handleMarkForReviewAndNext = () => {
    handleMarkForReview();
    handleSaveAndNext();
  };

  // Submit test to backend
  const handleSubmit = async () => {
    try {
      const payload = {
        userId: studentId,
        answers,
        questionStatus,
      };
      await axios.post(`http://localhost:5000/api/tests/${testId}/submit`, payload,{
        withCredentials: true,
      });
      navigate("/acme-test-result");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")} min`;
  };

  const getQuestionStatusColor = (id) => {
    const s = questionStatus[id];
    const isAnswered = answers[id] !== undefined;
    if (!s?.visited) return "bg-cyan-400 hover:bg-cyan-500";
    if (isAnswered && s?.markedForReview) return "bg-purple-500";
    if (s?.markedForReview) return "bg-pink-500";
    if (isAnswered) return "bg-green-500";
    return "bg-gray-800";
  };

  if (!testData) return <div>Loading...</div>;
  if (!testStarted)
    return (
      <InstructionsPage
  test={testData} 
  instructionsRead={instructionsRead}
  setInstructionsRead={setInstructionsRead}
  onStart={() => setTestStarted(true)}
/>

    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TimerHeader timeLeft={timeLeft} formatTime={formatTime} />
      <div className="flex min-h-screen">
        {/* Left Side - Question */}
        <div className="flex-1 p-6">
          {/* Sections */}
          <div className="mb-4 flex gap-2">
            {sections && sections.length > 0 && sections.map((sec) => (
  <Badge
    key={sec}
    className={`px-3 py-1 cursor-pointer ${
      sec === currentSection ? "bg-blue-600 text-white" : "bg-gray-200"
    }`}
    onClick={() => setCurrentSection(sec)}
  >
    {sec}
  </Badge>
))}

          </div>

          <QuestionCard
            question={testData.questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={testData.questions.length}
            answer={answers[testData.questions[currentQuestion]._id]}
            onAnswer={handleAnswer}
            onMarkForReviewAndNext={handleMarkForReviewAndNext}
            onClearResponse={handleClearResponse}
            onSaveAndNext={handleSaveAndNext}
          />
        </div>

        {/* Right Side - Palette */}
        <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-700">
          <QuestionPalette
  questions={testData.questions}
  currentQuestion={currentQuestion}
  onSelect={setCurrentQuestion}
  getQuestionStatusColor={getQuestionStatusColor}
  studentName={user?.username || "Student"}
  handleSubmit={handleSubmit}
  questionStatus={questionStatus}
  answers={answers}
  testId={testData._id} 
/>
        </div>
      </div>
    </div>
  );
};

export default Test;
