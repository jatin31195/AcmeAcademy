import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useAuth } from "@/AuthContext";

const SolutionView = ({
  results,
  onExit,
  sections = [],
  currentSectionIndex = 0,
  setCurrentSectionIndex,
}) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSection = sections[currentSectionIndex];
  const currentQ = currentSection?.questions?.[currentIndex];

  if (!currentQ) return <div>Loading question...</div>;


  const getAnswerValue = (ansObj) => {
    if (!ansObj) return undefined;

    const ans = ansObj.answer;
    if (ans === null || ans === undefined) return undefined;

    // Handle object answers
    if (typeof ans === "object") {
      return ans.value ?? ans.text ?? JSON.stringify(ans);
    }

    return ans.toString();
  };

  // Get user answer for current question
  const userAnswerObj = useMemo(
    () => results.answers?.find((a) => a.question === currentQ._id),
    [results, currentQ]
  );
  const userAnswer = getAnswerValue(userAnswerObj);

  const isCorrect = userAnswer === currentQ.correctAnswer;
  const isUnattempted = userAnswer === undefined || userAnswer === null;

  // Format time
  const formatTimeSpent = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Math-safe text rendering
  const renderWithMath = (text) => {
    if (!text) return "No question text";
    const parts = text.split(/(\$[^$]+\$)/g);
    return parts.map((part, i) => {
      if (part.startsWith("$") && part.endsWith("$")) {
        let math = part.slice(1, -1).trim();
        math = math
          .replace(/\\\\/g, "\\")
          .replace(/\\times/g, " \\times ")
          .replace(/\\div/g, " \\div ")
          .replace(/\\cdot/g, " \\cdot ")
          .replace(/\\pm/g, " \\pm ")
          .replace(/\\le/g, " \\le ")
          .replace(/\\ge/g, " \\ge ")
          .replace(/\\neq/g, " \\neq ")
          .replace(/\\infty/g, " \\infty ")
          .replace(/\\sqrt/g, " \\sqrt ")
          .replace(/\\frac/g, " \\frac ")
          .replace(/\\sum/g, " \\sum ")
          .replace(/\\to/g, " \\to ")
          .replace(/\\alpha/g, " \\alpha ")
          .replace(/\\beta/g, " \\beta ")
          .replace(/\\gamma/g, " \\gamma ")
          .replace(/\\delta/g, " \\delta ")
          .replace(/\\theta/g, " \\theta ")
          .replace(/\\pi/g, " \\pi ")
          .replace(/\\phi/g, " \\phi ")
          .replace(/\\sigma/g, " \\sigma ")
          .replace(/\\mu/g, " \\mu ")
          .replace(/\\lambda/g, " \\lambda ")
          .replace(/\{?(\d+)\s*\\choose\s*(\d+)\}?/g, "{$1 \\choose $2}")
          .replace(/\{?(\d+)\s*[Cc]\s*(\d+)\}?/g, "{$1 \\choose $2}")
          .replace(/\{?(\d+)\s*[Pp]\s*(\d+)\}?/g, "{$1 \\mathrm{P} $2}");
        return <InlineMath key={i} math={math} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Section navigation
  const handleSectionPrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentIndex(0);
    }
  };
  const handleSectionNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentIndex(0);
    }
  };

  /** ---------- Stats Calculation ---------- **/
  const correctCount =
    currentSection?.questions?.filter((q) => {
      const ansObj = results.answers?.find((a) => a.question === q._id);
      const ans = getAnswerValue(ansObj);
      return ans === q.correctAnswer;
    })?.length || 0;

  const incorrectCount =
    currentSection?.questions?.filter((q) => {
      const ansObj = results.answers?.find((a) => a.question === q._id);
      const ans = getAnswerValue(ansObj);
      return ans !== undefined && ans !== q.correctAnswer;
    })?.length || 0;

  const unattemptedCount =
    (currentSection?.questions?.length || 0) -
    correctCount -
    incorrectCount;

  /** ---------- JSX ---------- **/
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap">
        <h1 className="text-base font-medium">
          {results.title} | {currentSection?.name || "Section"}
        </h1>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span className="text-sm text-gray-600">
            ⏱️ Total Time: {formatTimeSpent(results.timeSpent || 0)}
          </span>
        </div>
      </div>

      {/* SECTION NAVIGATOR */}
      {sections.length > 1 && (
        <div className="border-b flex items-center justify-between px-4 py-2 bg-cyan-500 text-white">
          <ChevronLeft
            className={`h-5 w-5 cursor-pointer ${
              currentSectionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSectionPrev}
          />
          <span className="text-sm font-medium">{currentSection?.name}</span>
          <ChevronRight
            className={`h-5 w-5 cursor-pointer ${
              currentSectionIndex === sections.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleSectionNext}
          />
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden gap-4">
        {/* QUESTION PANEL */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center justify-between flex-wrap">
            <h2 className="text-lg font-semibold">
              Question-{currentIndex + 1}
            </h2>
            <span className="text-sm text-gray-500">
              ⏱️ Time: {formatTimeSpent(currentQ.timeSpent || 0)}
            </span>
          </div>

          {/* Question Text */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 text-gray-800 leading-relaxed">
            {renderWithMath(currentQ.text)}
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {currentQ.options.map((option, idx) => {
              const ans = userAnswer;
              const isUserAnswerOption =
                ans === option || ans === idx || ans === option.toString();
              const isCorrectOption =
                currentQ.correctAnswer === option ||
                currentQ.correctAnswer === idx ||
                currentQ.correctAnswer?.toString() === option.toString();

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded border ${
                    isCorrectOption
                      ? "bg-green-100 border-green-500"
                      : isUserAnswerOption
                      ? "bg-red-100 border-red-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isCorrectOption && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  {isUserAnswerOption && !isCorrectOption && (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  {!isCorrectOption && !isUserAnswerOption && (
                    <div className="w-5 h-5 mt-0.5" />
                  )}
                  <span className="flex-1">{renderWithMath(option)}</span>
                </div>
              );
            })}
          </div>

          {/* Solution / Explanation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">
              Solution / Explanation
            </h4>

            {/* Correct Answer */}
            <p className="text-sm text-gray-700 mb-1">
              ✅ Correct Answer:{" "}
              {typeof currentQ.correctAnswer === "number" ? (
                <>
                  Option {currentQ.correctAnswer + 1} —{" "}
                  {renderWithMath(currentQ.options[currentQ.correctAnswer])}
                </>
              ) : (
                renderWithMath(currentQ.correctAnswer)
              )}
            </p>

            {/* User Answer */}
                <p
        className={`text-sm mb-2 ${
            isUnattempted ? "text-gray-600" : "text-blue-600"
        }`}
        >
        {isUnattempted ? (
            "⚪ You did not attempt this question."
        ) : (
            <>
            🟢 You selected:&nbsp;
            {typeof userAnswer === "number"
                ? (
                    <span className="font-medium">
                    Option {userAnswer + 1} —{" "}
                    {renderWithMath(currentQ.options[userAnswer])}
                    </span>
                )
                : (
                    <span className="font-medium">{renderWithMath(userAnswer)}</span>
                )}
            </>
        )}
        </p>


        
            <p className="text-sm text-gray-600 italic">
              {currentQ.explanation ||
                currentQ.solution?.text ||
                "Explanation not available."}
            </p>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full md:w-80 border-l bg-gray-50 p-4 md:p-6 overflow-auto flex-shrink-0">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-sm">
              {user?.username || "Student"}
            </span>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-xs mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-500"></div>
                <span>Correct</span>
              </div>
              <span className="font-bold">{correctCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-500"></div>
                <span>Incorrect</span>
              </div>
              <span className="font-bold">{incorrectCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gray-300"></div>
                <span>Unattempted</span>
              </div>
              <span className="font-bold">{unattemptedCount}</span>
            </div>
          </div>

          {/* Question Palette */}
          <h3 className="font-bold text-center mb-3">
            {currentSection?.name}
          </h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {currentSection?.questions?.map((q, i) => {
              const ans = getAnswerValue(
                results.answers?.find((a) => a.question === q._id)
              );
              const correct = ans === q.correctAnswer;
              const unattempted = ans === undefined || ans === null;

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold transition-all ${
                    unattempted
                      ? "bg-white border-2 border-gray-300 text-gray-700"
                      : correct
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  } ${currentIndex === i ? "ring-2 ring-cyan-500 ring-offset-2" : ""}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <Button
            onClick={onExit}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white mt-4"
          >
            View Summary
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t px-4 py-4 flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            currentIndex < currentSection.questions.length - 1 &&
            setCurrentIndex(currentIndex + 1)
          }
          disabled={currentIndex === currentSection.questions.length - 1}
          className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SolutionView;
