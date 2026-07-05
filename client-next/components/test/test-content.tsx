"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InstructionsPage from "@/components/test/instructions-page";
import TestView from "@/components/test/test-view";
import { BASE_URL } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

// Ported from client/src/pages/Test.jsx. Every timer/state-machine detail
// preserved exactly (total-test timer, per-section timer, auto-submit,
// question-status tracking, time-per-question recording). SEO/JSON-LD is
// explicitly out of scope for this phase (per the Phase 3 brief) and is not
// reproduced here — this was a private, ProtectedRoute-gated page whose
// dynamic SEO tags were only ever rendered client-side after the test data
// loaded anyway, so nothing crawlable is lost; noindex is set statically in
// the Server page.tsx wrapper instead.

type TestSection = { title: string; durationMinutes: number; numQuestions: number };
type TestQuestion = { _id: string; question?: string; text?: string; options: string[] };
type TestData = {
  title: string;
  description?: string;
  examType?: string;
  totalDurationMinutes: number;
  totalQuestions?: number;
  totalMarks?: number;
  sections: TestSection[];
  questions: TestQuestion[];
};

export function TestContent({ testId }: { testId: string }) {
  const auth = useAuth();
  const user = auth?.user;
  const router = useRouter();

  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [questionStatus, setQuestionStatus] = useState<Record<string, { visited?: boolean; answered?: boolean; markedForReview?: boolean }>>({});
  const [instructionsRead, setInstructionsRead] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [questionTimeTaken, setQuestionTimeTaken] = useState<Record<string, number>>({});
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tests/${testId}`, { withCredentials: true });

        const data = res.data;
        setTestData(data);

        setSectionIndex(0);
        setCurrentSection(data.sections[0].title);

        setTimeLeft(data.totalDurationMinutes * 60);

        setSectionTimeLeft(data.sections[0].durationMinutes * 60);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (!testStarted || sectionTimeLeft <= 0) return;

    const timer = setInterval(() => {
      setSectionTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, sectionTimeLeft]);

  useEffect(() => {
    if (!testStarted) return;
    if (sectionTimeLeft > 0) return;
    if (!testData) return;

    const nextIndex = sectionIndex + 1;

    if (nextIndex < testData.sections.length) {
      const nextSection = testData.sections[nextIndex];

      // eslint-disable-next-line react-hooks/set-state-in-effect -- section auto-advance on timer expiry, ported behavior
      setSectionIndex(nextIndex);
      setCurrentSection(nextSection.title);

      setCurrentQuestion(0);

      setSectionTimeLeft(nextSection.durationMinutes * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTimeLeft, testStarted]);

  const handleSubmit = async () => {
    try {
      recordTimeForCurrentQuestion();
      // eslint-disable-next-line react-hooks/purity -- auto-submit is invoked from the timeLeft countdown's setState updater, ported behavior
      const totalTimeTaken = Math.floor((Date.now() - (testStartTime ?? Date.now())) / 1000);
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

      router.push(`/acme-test-result/${testId}`);
    } catch (err) {
      console.error((err as { response?: { data?: unknown } })?.response?.data || (err as Error).message);
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStarted, timeLeft]);

  useEffect(() => {
    if (testStarted && testData) {
      const currentQ = testData.questions[currentQuestion];
      // eslint-disable-next-line react-hooks/set-state-in-effect -- question-visited tracking on navigation, ported behavior
      setQuestionStatus((prev) => ({
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
      setQuestionTimeTaken((prev) => ({
        ...prev,
        [qId]: (prev[qId] || 0) + timeSpent,
      }));
      setQuestionStartTime(Date.now());
    }
  };

  const handleAnswer = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], answered: true, visited: true },
    }));
  };

  const handleMarkForReviewAndNext = () => {
    recordTimeForCurrentQuestion();
    if (!testData) return;
    const currentQ = testData.questions[currentQuestion];
    setQuestionStatus((prev) => ({
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
    if (!testData) return;

    const currentSectionObj = testData.sections[sectionIndex];
    const maxQ = currentSectionObj.numQuestions - 1;

    if (currentQuestion < maxQ) {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")} min`;
  };

  const getQuestionStatusColor = (id: string) => {
    const status = questionStatus[id];
    const answered = answers[id] !== undefined;
    if (!status?.visited) return "bg-white border-2 border-gray-300 text-gray-700";
    if (answered && status?.markedForReview) return "bg-purple-600 text-white";
    if (status?.markedForReview) return "bg-purple-400 text-white";
    if (answered) return "bg-green-500 text-white";
    return "bg-red-500 text-white";
  };

  const statusCounts = {
    notAnswered: Object.values(questionStatus).filter((q) => q.visited && !q.answered).length,
    marked: Object.values(questionStatus).filter((q) => q.markedForReview).length,
    answered: Object.values(questionStatus).filter((q) => q.answered).length,
    notVisited: Object.values(questionStatus).filter((q) => !q.visited).length,
    answeredAndMarked: Object.values(questionStatus).filter((q) => q.answered && q.markedForReview).length,
  };

  if (!testData) return <div>Loading...</div>;

  return !testStarted ? (
    <InstructionsPage
      test={testData}
      instructionsRead={instructionsRead}
      setInstructionsRead={setInstructionsRead}
      onStart={() => {
        setTestStarted(true);
        setTestStartTime(Date.now());
        setQuestionStartTime(Date.now());
      }}
      username={(user as { username?: string } | null)?.username || "Student"}
    />
  ) : (
    <TestView
      user={user as { username?: string } | null}
      testData={testData}
      currentQuestion={currentQuestion}
      setCurrentQuestion={setCurrentQuestion}
      answers={answers}
      handleAnswer={handleAnswer}
      handleMarkForReviewAndNext={handleMarkForReviewAndNext}
      handleSaveAndNext={handleSaveAndNext}
      handleSubmit={handleSubmit}
      timeLeft={timeLeft}
      sectionTimeLeft={sectionTimeLeft}
      statusCounts={statusCounts}
      getQuestionStatusColor={getQuestionStatusColor}
      formatTime={formatTime}
      currentSection={currentSection}
    />
  );
}
