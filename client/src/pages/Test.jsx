import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InstructionsPage from "../components/Test/InstructionsPage";
import TimerHeader from "../components/Test/TimerHeader";
import QuestionCard from "../components/Test/QuestionCard";
import QuestionPalette from "../components/Test/QuestionPalette";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const Test = ({ studentName = "Student Name" }) => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [testStarted, setTestStarted] = useState(false);
  const [questionStatus, setQuestionStatus] = useState({});
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [sections, setSections] = useState(["Mathematics"]);
  const [currentSection, setCurrentSection] = useState("Mathematics");

  // --- Sample Questions ---
  const questions = [
    { id: 1, question: "The value of cos 12° + cos 84° + cos 156° + cos 132° is", options: ["1/8", "-1/2", "1", "1/2"], correctAnswer: 1 },
    { id: 2, question: "In how many ways can 5 people be arranged in a row?", options: ["120", "24", "60", "720"], correctAnswer: 0 },
    { id: 3, question: "Number of ways to select 3 students out of 10 for a project?", options: ["100", "120", "720", "240"], correctAnswer: 1 },
    // Add more questions as needed
  ];

  // --- Timer ---
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
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

  // --- Mark question visited ---
  useEffect(() => {
    if (testStarted) {
      const currentQ = questions[currentQuestion];
      setQuestionStatus((prev) => ({
        ...prev,
        [currentQ.id]: {
          ...prev[currentQ.id],
          visited: true,
          answered: answers[currentQ.id] !== undefined,
          markedForReview: prev[currentQ.id]?.markedForReview || false,
        },
      }));
    }
  }, [currentQuestion, testStarted]);

  // --- Tab switch detection ---
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

  // --- Fullscreen ---
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {});
  }, []);

  // --- Answer Handlers ---
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], answered: true, visited: true },
    }));
  };

  const handleMarkForReview = () => {
    const currentQ = questions[currentQuestion];
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQ.id]: { ...prev[currentQ.id], markedForReview: !prev[currentQ.id]?.markedForReview, visited: true },
    }));
  };

  const handleClearResponse = () => {
    const currentQ = questions[currentQuestion];
    const newAnswers = { ...answers };
    delete newAnswers[currentQ.id];
    setAnswers(newAnswers);
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQ.id]: { ...prev[currentQ.id], answered: false, visited: true },
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
  };

  const handleMarkForReviewAndNext = () => {
    handleMarkForReview();
    handleSaveAndNext();
  };

  const calculateScore = () => {
    let correct = 0, incorrect = 0;
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans !== undefined) (ans === q.correctAnswer ? correct++ : incorrect++);
    });
    return correct * 4 - incorrect;
  };

  const handleSubmit = () => {
    const result = {
      answers,
      questions,
      topicId,
      timeSpent: 1800 - timeLeft,
      questionStatus,
      testName: "Trigonometry - T06",
      totalMarks: questions.length * 4,
    };
    localStorage.setItem("testResults", JSON.stringify(result));

    const testHistory = JSON.parse(localStorage.getItem("testHistory") || "[]");
    const newTest = {
      testName: "Trigonometry - T06",
      date: new Date().toISOString(),
      attempted: Object.keys(answers).length,
      correct: questions.filter(q => answers[q.id] === q.correctAnswer).length,
      score: calculateScore(),
      rank: Math.floor(Math.random() * 1000) + 1,
    };
    testHistory.push(newTest);
    localStorage.setItem("testHistory", JSON.stringify(testHistory));

    navigate("/test-result");
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

  if (!testStarted)
    return (
      <InstructionsPage
        questions={questions}
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
            {sections.map((sec) => (
              <Badge
                key={sec}
                className={`px-3 py-1 cursor-pointer ${
                  sec === currentSection ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => {
                  if (questions.every(q => answers[q.id] !== undefined)) setCurrentSection(sec);
                }}
              >
                {sec}
              </Badge>
            ))}
          </div>

          <QuestionCard
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            answer={answers[questions[currentQuestion].id]}
            onAnswer={handleAnswer}
            onMarkForReviewAndNext={handleMarkForReviewAndNext}
            onClearResponse={handleClearResponse}
            onSaveAndNext={handleSaveAndNext}
          />
        </div>

        {/* Right Side - Palette */}
        <div className="hidden lg:block w-80 border-l border-gray-200 dark:border-gray-700">
    <QuestionPalette
      questions={questions}
      currentQuestion={currentQuestion}
      onSelect={setCurrentQuestion}
      getQuestionStatusColor={getQuestionStatusColor}
      studentName={studentName}
      handleSubmit={handleSubmit}
      questionStatus={questionStatus}
      answers={answers}
    />
  </div>
      </div>
    </div>
  );
};

export default Test;
