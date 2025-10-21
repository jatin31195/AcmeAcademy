import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InstructionsPage from "../components/Test/InstructionsPage";
import { useAuth } from "@/AuthContext";
import TestView from "../components/Test/TestView";

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
  useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);

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

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")} min`;
  };

  const getQuestionStatusColor = (id) => {
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

  return (
    <TestView
      user={user}
      testData={testData}
      currentQuestion={currentQuestion}
      setCurrentQuestion={setCurrentQuestion}
      answers={answers}
      handleAnswer={handleAnswer}
      handleMarkForReviewAndNext={handleMarkForReviewAndNext}
      handleSaveAndNext={handleSaveAndNext}
      handleSubmit={handleSubmit}
      timeLeft={timeLeft}
      questionStatus={questionStatus}
      statusCounts={statusCounts}
      getQuestionStatusColor={getQuestionStatusColor}
      formatTime={formatTime}
      currentSection={currentSection}
    />
  );
};

export default Test;
