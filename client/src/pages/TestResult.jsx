import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/AuthContext";

const TestResult = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { testId } = useParams();

  const [results, setResults] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      data.answers.forEach(ansArrayItem => {
        ansArrayItem.__parentArray.forEach(ans => {
          answerMap[ans.question] = ans.answer;
        });
      });

      const questions = data.answers?.[0]?.$__parent?.test?.questions || [];

      setResults({
        title: data.answers?.[0]?.$__parent?.test?.title || data.testTitle || "Test",
        category: data.answers?.[0]?.$__parent?.test?.sections?.[0]?.title || "General",
        questions,
        answers: answerMap,
        correct: data.stats.correct,
        incorrect: data.stats.incorrect,
        unattempted: data.stats.unattempted,
        totalScore: data.stats.totalScore,
        timeSpent: data.stats.totalTimeSpent || 0,
      });
    } catch (err) {
      console.error("Error fetching test result:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchResult();
}, [user, loading, testId]);


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
  if (showSolutions) {
    const currentQ = results.questions[currentSolutionIndex];
    const userAnswer = results.answers ? results.answers[currentQ._id] : undefined;
    const isCorrect = userAnswer === currentQ.correctAnswer;
    const isUnattempted = userAnswer === undefined;

    return (
      <div className="min-h-screen bg-white flex flex-col">
    
        <div className="border-b px-6 py-3 flex items-center justify-between">
          <h1 className="text-base font-medium">
            {results.title} | {results.category}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Time taken: {formatTimeSpent(results.timeSpent)}
            </span>
            <Button variant="outline" className="border-cyan-500 text-cyan-500">
              🔍 Filter Questions
            </Button>
          </div>
        </div>

      
        <div className="border-b flex items-center justify-between px-4 py-2 bg-cyan-500 text-white">
          <ChevronLeft
            className="h-5 w-5 cursor-pointer"
            onClick={() =>
              currentSolutionIndex > 0 &&
              setCurrentSolutionIndex(currentSolutionIndex - 1)
            }
          />
          <span className="text-sm font-medium">{results.category}</span>
          <ChevronRight
            className="h-5 w-5 cursor-pointer"
            onClick={() =>
              currentSolutionIndex < results.questions.length - 1 &&
              setCurrentSolutionIndex(currentSolutionIndex + 1)
            }
          />
        </div>

        <div className="flex flex-1">
         
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    Question-{currentSolutionIndex + 1}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      isUnattempted
                        ? "bg-gray-200 text-gray-700"
                        : isCorrect
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isUnattempted
                      ? "Unattempted"
                      : isCorrect
                      ? "Correct"
                      : "Incorrect"}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-base leading-relaxed mb-6">{currentQ.question}</p>

                <div className="space-y-3 mb-6">
                  {currentQ.options.map((option, optIndex) => {
                    const isUserAnswer = userAnswer === optIndex;
                    const isCorrectAnswer = currentQ.correctAnswer === optIndex;

                    return (
                      <div
                        key={optIndex}
                        className={`flex items-start gap-3 p-3 rounded border ${
                          isCorrectAnswer
                            ? "bg-green-100 border-green-500"
                            : isUserAnswer
                            ? "bg-red-100 border-red-500"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        {isCorrectAnswer && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        {!isCorrectAnswer && !isUserAnswer && <div className="w-5 h-5 mt-0.5"></div>}
                        <span className="flex-1">{option}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Solution</h4>
                  <p className="text-sm text-gray-700">
                    The correct answer is option {currentQ.correctAnswer + 1}:{" "}
                    {currentQ.options[currentQ.correctAnswer]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l bg-gray-50 p-6 overflow-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                {user?.name?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <span className="font-semibold text-sm">{user?.name || "Student"}</span>
            </div>

            <div className="space-y-2 text-xs mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-red-500"></div>
                  <span>Incorrect</span>
                </div>
                <span className="font-bold">{results.incorrect}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-white border-2"></div>
                  <span>Unattempted</span>
                </div>
                <span className="font-bold">{results.unattempted}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-green-500"></div>
                  <span>Correct</span>
                </div>
                <span className="font-bold">{results.correct}</span>
              </div>
            </div>

            <h3 className="font-bold text-center mb-3">{results.category}</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {results.questions.map((q, index) => {
                const userAnswer = results.answers[q._id];
                const isCorrect = userAnswer === q.correctAnswer;
                const isUnattempted = userAnswer === undefined;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentSolutionIndex(index)}
                    className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold cursor-pointer transition-all ${
                      isUnattempted
                        ? "bg-white border-2"
                        : isCorrect
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    } ${currentSolutionIndex === index ? "ring-2 ring-cyan-500 ring-offset-2" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setShowSolutions(false)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              View Summary
            </Button>
          </div>
        </div>
      </div>
    );
  }

 
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
          <p className="text-orange-500 text-sm mb-8">⏱️ {formatTimeSpent(results.timeSpent)}</p>

          <p className="text-gray-500 text-sm mb-8">{accuracy}% ACCURACY</p>

          <div className="space-y-4 mb-8">
            {[
              { color: "bg-purple-400", label: "Total Questions", value: results.questions.length, symbol: "?" },
              { color: "bg-green-500", label: "Correct Answers", value: results.correct, symbol: "✓" },
              { color: "bg-red-500", label: "Incorrect Answers", value: results.incorrect, symbol: "✕" },
              { color: "bg-gray-400", label: "Unattempted Questions", value: results.unattempted, symbol: "○" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${item.color} text-white flex items-center justify-center`}>
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
