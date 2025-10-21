import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@/AuthContext";
import SolutionView from "@/components/Test/SolutionView";

const TestResult = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { testId } = useParams();

  const [results, setResults] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/tests/${testId}/result`,
          { withCredentials: true }
        );

        const data = res.data;
        if (!data || !data.answers || !data.stats) {
          console.error("Invalid response:", data);
          return;
        }

        const answerMap = {};
        data.answers.forEach((ansArrayItem) => {
          ansArrayItem.__parentArray.forEach((ans) => {
            answerMap[ans.question] = ans.answer;
          });
        });

        const questions = data.answers?.[0]?.$__parent?.test?.questions || [];

        setResults({
  title: data.answers?.[0]?.$__parent?.test?.title || data.testTitle || "Test",
  timeSpent: data.stats.totalTimeSpent || 0,
  answers: data.answers.map(ansArrayItem => ansArrayItem.__parentArray).flat(), // array of {question, answer}
  correct: data.stats.correct,
  incorrect: data.stats.incorrect,
  unattempted: data.stats.unattempted,
  totalScore: data.stats.totalScore,
  sections: [
    {
      name:
        data.answers?.[0]?.$__parent?.test?.sections?.[0]?.title || "Section 1",
      questions:
        data.answers?.[0]?.$__parent?.test?.questions?.map((q) => ({
          _id: q._id,
          text: q.text || q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
        })) || [],
    },
  ],
});

      } catch (err) {
        console.error("Error fetching test result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [user, testId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading your test result...
      </div>
    );

  if (!results) return null;

  const formatTimeSpent = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes, ${secs} seconds`;
  };

  const accuracy =
    results.correct + results.incorrect > 0
      ? ((results.correct / (results.correct + results.incorrect)) * 100).toFixed(0)
      : 0;

  // ✅ Show Solution / Review Screen
  if (showSolutions) {
    return <SolutionView
      results={results}
      sections={results.sections} // pass sections here
      currentSectionIndex={currentSectionIndex}
      setCurrentSectionIndex={setCurrentSectionIndex}
      onExit={() => setShowSolutions(false)}
    />
  }

  // SUMMARY VIEW
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-lg font-medium">
            {results.title} | {results.category}
          </h1>
          <Button variant="outline" className="border-cyan-500 text-cyan-500">
            <Download className="h-4 w-4 mr-2" />
            Download Pdf
          </Button>
        </div>

        <div className="bg-white border-2 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-sm mb-2">SCORE</p>
          <h2 className="text-6xl font-bold text-cyan-500 mb-2">{results.totalScore}</h2>
          <p className="text-gray-500 mb-2">OUT OF 100</p>
          <p className="text-orange-500 text-sm mb-8">
            ⏱️ {formatTimeSpent(results.timeSpent)}
          </p>

          <p className="text-gray-500 text-sm mb-8">{accuracy}% ACCURACY</p>

          <div className="space-y-4 mb-8">
            {[
              {
                color: "bg-purple-400",
                label: "Total Questions",
                value: results.sections?.[0]?.questions?.length || 0
,
                symbol: "?",
              },
              {
                color: "bg-green-500",
                label: "Correct Answers",
                value: results.correct,
                symbol: "✓",
              },
              {
                color: "bg-red-500",
                label: "Incorrect Answers",
                value: results.incorrect,
                symbol: "✕",
              },
              {
                color: "bg-gray-400",
                label: "Unattempted Questions",
                value: results.unattempted,
                symbol: "○",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center`}
                  >
                    {item.symbol}
                  </div>
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
            View Solutions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;
