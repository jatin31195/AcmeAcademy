import { InlineMath , BlockMath} from "react-katex";
import { ChevronLeft, ChevronRight, Info, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import "katex/dist/katex.min.css";

const TestView = ({
  testData,
  user,
  currentQuestion,
  setCurrentQuestion,
  answers,
  handleAnswer,
  handleMarkForReviewAndNext,
  handleSaveAndNext,
  handleSubmit,
  questionStatus,
  getQuestionStatusColor,
  statusCounts,
  formatTime,
  timeLeft,
  currentSection,
}) => {
  const questions = testData.questions;
  const currentQ = questions[currentQuestion];

  const renderWithMath = (text) => {
  if (!text) return "No question text";

  // Split normal and math parts
  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, i) => {
    // Handle math segments ($...$)
    if (part.startsWith("$") && part.endsWith("$")) {
      let math = part.slice(1, -1).trim();
      const isMatrix = /\\begin\{bmatrix\}|\\begin\{pmatrix\}|\\\\/.test(math);
      // Normalize symbols and support C/P, etc.
      math = math
        .replace(/\\\\/g, "\\") // fix double backslashes
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
        // Handle combination & permutation
        .replace(/\{?(\d+)\s*\\choose\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Cc]\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Pp]\s*(\d+)\}?/g, "{$1 \\mathrm{P} $2}");

      return isMatrix ? (
        <BlockMath key={i} math={math} />
      ) : (
        <InlineMath key={i} math={math} />
      );
    }

    // Normal text
    return <span key={i}>{part}</span>;
  });
};

  return (
    <div className="min-h-screen bg-white flex flex-col">
  
      <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap">
        <h1 className="text-base font-medium">
          {testData.title || "Practice Test"} | {testData.category || "General"}
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

   
      <div className="border-b flex items-center justify-between px-4 py-2 bg-cyan-500 text-white">
        <ChevronLeft className="h-5 w-5 cursor-pointer" />
        <span className="text-sm font-medium">{currentSection}</span>
        <ChevronRight className="h-5 w-5 cursor-pointer" />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden gap-4">
        {/* Question Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center justify-between flex-wrap">
            <h2 className="text-lg font-semibold">
              Question-{currentQuestion + 1}
            </h2>
            <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
              <span className="text-sm">
                Marking:{" "}
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

          {/* Question */}
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

        {/* Sidebar */}
        <div className="w-full md:w-80 border-l bg-gray-50 p-4 md:p-6 overflow-auto flex-shrink-0">
          {/* User */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-sm">
              {user?.username || "Student"}
            </span>
          </div>

          {/* Status Legend */}
          <h4 className="font-semibold text-sm mb-2 text-gray-700">
            Question Status
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs mb-6">
            {[
              ["Not Visited", "bg-white border-2 border-gray-300", statusCounts.notVisited],
              ["Not Answered", "bg-red-500", statusCounts.notAnswered],
              ["Answered", "bg-green-500", statusCounts.answered],
              ["Marked for Review", "bg-purple-400", statusCounts.marked],
              ["Answered & Marked", "rotate-45 bg-purple-600", statusCounts.answeredAndMarked],
            ].map(([label, color, count], i) => (
              <div key={i} className={`flex items-center justify-between ${i === 4 ? "col-span-2" : ""}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md ${color}`}></div>
                  <span>{label}</span>
                </div>
                <span className="font-bold text-gray-700">{count || 0}</span>
              </div>
            ))}
          </div>

          {/* Palette */}
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
      <div className="border-t px-4 py-4 flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => {
            recordTimeForCurrentQuestion();
            if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
            }}
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

export default TestView;
