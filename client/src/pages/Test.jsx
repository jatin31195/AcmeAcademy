import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import InstructionsPage from "../components/Test/InstructionsPage";
import { useAuth } from "@/AuthContext";
import TestView from "../components/Test/TestView";
import { BASE_URL } from "../config";
import SEO from "../components/SEO";

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
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimeTaken, setQuestionTimeTaken] = useState({});
  const [testStartTime, setTestStartTime] = useState(null);

  useEffect(() => {
  if (!user) {
    navigate("/login");
  }
}, [user, navigate]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tests/${testId}`, { withCredentials: true });
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

  const recordTimeForCurrentQuestion = () => {
  if (questionStartTime && testData?.questions[currentQuestion]) {
    const qId = testData.questions[currentQuestion]._id;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); 
    setQuestionTimeTaken(prev => ({
      ...prev,
      [qId]: (prev[qId] || 0) + timeSpent,
    }));
    setQuestionStartTime(Date.now()); 
  }
};

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], answered: true, visited: true },
    }));
  };

  const handleMarkForReviewAndNext = () => {
    recordTimeForCurrentQuestion();
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
    recordTimeForCurrentQuestion();
    if (currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
    }
  };

  const handleSubmit = async () => {
  try {
    recordTimeForCurrentQuestion(); 
    const totalTimeTaken = Math.floor((Date.now() - testStartTime) / 1000);
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      question: questionId,
      answer,
      timeTaken: questionTimeTaken[questionId] || 0, 
    }));

    await axios.post(
      `${BASE_URL}/api/tests/${testId}/submit`,
      {
        answers: formattedAnswers,
        questionStatus,
        totalTimeTaken,
      },
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
const jsonLd = testData
    ? {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": testData.title || "ACME Academy Mock Test",
        "description":
          testData.description ||
          "Attempt MCA entrance mock tests by ACME Academy with real-time timer and analytics.",
        "url": `https://www.acmeacademy.in/test/${testId}`,
        "about": {
          "@type": "Course",
          "name": testData.examType || "MCA Entrance Preparation",
          "provider": {
            "@type": "Organization",
            "name": "ACME Academy",
            "url": "https://www.acmeacademy.in",
            "logo": "https://www.acmeacademy.in/assets/logo.png",
            "sameAs": [
              "https://www.facebook.com/acmeacademy",
              "https://www.youtube.com/@acmeacademy",
              "https://www.instagram.com/acmeacademy"
            ]
          }
        },
        "learningResourceType": "Practice Test",
        "educationalLevel": "Postgraduate",
        "timeRequired": `PT${testData.totalDurationMinutes || 60}M`,
        "hasPart": testData.questions?.map((q, index) => ({
          "@type": "Question",
          "position": index + 1,
          "name": q.questionText || `Question ${index + 1}`,
          "acceptedAnswer": q.correctAnswer
            ? { "@type": "Answer", "text": q.correctAnswer }
            : undefined
        })),
        "creator": {
          "@type": "Organization",
          "name": "ACME Academy",
          "url": "https://www.acmeacademy.in"
        }
      }
    : null;
  if (!testData) return <div>Loading...</div>;

 

  return (
    <>
  {testData && (
    <SEO
      title={`${testData.title} | ACME Academy Test`}
      description={`Attempt ${testData.title} by ACME Academy — India's most trusted platform for MCA Entrance preparation.`}
      url={`https://www.acmeacademy.in/test/${testId}`}
      image="https://www.acmeacademy.in/assets/test-preview.png"
      keywords="MCA entrance test, NIMCET mock test, CUET MCA online test, ACME Academy, practice exam, test series"
      jsonLd={jsonLd}
    />
  )}

  
  {!testStarted ? (
    <InstructionsPage
      test={testData}
      instructionsRead={instructionsRead}
      setInstructionsRead={setInstructionsRead}
      onStart={() => {
        setTestStarted(true);
        setTestStartTime(Date.now());
        setQuestionStartTime(Date.now());
      }}
      username={user?.username || "Student"}
    />
  ) : (
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
  )}
</>

  );
};

export default Test;
