"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import SolutionView from "@/components/test/solution-view";
import { BASE_URL } from "@/lib/config";
import { useAuth } from "@/providers/auth-provider";

// Ported from client/src/pages/TestResult.jsx.
type ResultQuestion = {
  questionId?: string;
  questionText?: string;
  options: string[];
  userAnswer?: string | null;
  correctAnswer?: string;
  result?: string;
  timeTaken?: number;
  solution?: { text?: string };
};
type ResultSection = {
  title?: string;
  questions?: ResultQuestion[];
  stats?: { correct: number; incorrect: number; unattempted: number };
};
type TestResults = {
  testTitle?: string;
  category?: string;
  totalScore?: number;
  totalMarks?: number;
  totalTimeTaken?: number;
  accuracy?: number;
  questions?: ResultQuestion[];
  sections?: ResultSection[];
  stats?: { correct: number; incorrect: number; unattempted: number; positiveMarks: number; negativeMarks: number };
};

export function TestResultContent({ testId, attemptNumber }: { testId: string; attemptNumber?: string }) {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user;
  const authLoading = auth?.loading;
  const [results, setResults] = useState<TestResults | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ported from client/src/routes/ProtectedRoute.jsx, which this page relied
  // on entirely (unlike Test/Profile, TestResult.jsx never checked `user`
  // itself). middleware.ts only checks accessToken cookie *presence*, not
  // validity — a present-but-expired cookie previously let this page render
  // indefinitely instead of bouncing to /login once the refresh attempt
  // failed, as the original's ProtectedRoute did.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?from=${encodeURIComponent(attemptNumber ? `/acme-test-result/${testId}/${attemptNumber}` : `/acme-test-result/${testId}`)}`);
    }
  }, [authLoading, user, router, testId, attemptNumber]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const endpoint = attemptNumber
          ? `${BASE_URL}/api/tests/${testId}/attempt/${attemptNumber}/result`
          : `${BASE_URL}/api/tests/${testId}/result`;

        const res = await axios.get(endpoint, { withCredentials: true });
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching test result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [testId, attemptNumber]);

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center bg-white text-gray-600">Loading session...</div>;
  }

  if (!user) return null; // redirecting via the effect above

  if (loading)
    return <div className="h-screen flex items-center justify-center text-gray-500">Loading your test result...</div>;

  if (!results) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const { stats } = results;

  if (showSolutions) {
    return <SolutionView results={results} onExit={() => setShowSolutions(false)} />;
  }

  return (
    <div className="min-h-screen bg-white p-8 relative">
      <div className="absolute top-4 left-4">
        <Button onClick={() => router.back()} variant="outline" className="border-gray-400 text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-lg font-medium">
              {results.testTitle}
              {results.category ? ` | ${results.category}` : ""}
            </h1>
            <Button variant="outline" className="border-cyan-500 text-cyan-500">
              <Download className="h-4 w-4 mr-2" />
              Download Pdf
            </Button>
          </div>

          <div className="bg-white border-2 rounded-lg p-12 text-center">
            <p className="text-gray-500 text-sm mb-2">TOTAL SCORE</p>
            <h2 className="text-6xl font-bold text-cyan-500 mb-2">{results.totalScore}</h2>
            <p className="text-gray-500 mb-2">OUT OF {results.totalMarks}</p>
            <p className="text-orange-500 text-sm mb-8">⏱️ {formatTime(results.totalTimeTaken || 0)}</p>

            <p className="text-gray-600 text-sm mb-8">
              Accuracy: <span className="font-semibold text-cyan-600">{results.accuracy}%</span>
            </p>

            <div className="space-y-4 mb-8">
              {(
                [
                  { color: "bg-purple-400", label: "Total Questions", value: results.questions?.length || 0, symbol: "?" },
                  { color: "bg-green-500", label: "Correct Answers", value: stats?.correct, symbol: "✓" },
                  { color: "bg-red-500", label: "Incorrect Answers", value: stats?.incorrect, symbol: "✕" },
                  { color: "bg-gray-400", label: "Unattempted Questions", value: stats?.unattempted, symbol: "○" },
                  { color: "bg-blue-400", label: "Positive Marks", value: stats?.positiveMarks, symbol: "+" },
                  { color: "bg-orange-400", label: "Negative Marks", value: stats?.negativeMarks, symbol: "-" },
                ] as { color: string; label: string; value: number | undefined; symbol: string }[]
              ).map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center`}>{item.symbol}</div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setShowSolutions(true)}
              className="w-full bg-white hover:bg-gray-50 text-cyan-500 border-2 border-cyan-500 py-6 text-lg font-semibold"
            >
              View Detailed Solutions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
