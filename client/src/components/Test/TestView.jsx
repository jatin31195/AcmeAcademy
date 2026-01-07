import { InlineMath, BlockMath } from "react-katex";
import { ChevronLeft, ChevronRight, Info, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
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
  timeLeft,            // total test time (still shown top)
  sectionTimeLeft,     // ✅ NEW: section timer
  currentSection,
}) => {

  /* =========================
     SECTION → QUESTIONS MAP
  ========================== */

  const sectionIndex = testData.sections.findIndex(
    (s) => s.title === currentSection
  );

  const sectionQuestions = useMemo(() => {
    if (sectionIndex === -1) return [];

    let start = 0;
    for (let i = 0; i < sectionIndex; i++) {
      start += testData.sections[i].numQuestions;
    }

    const count = testData.sections[sectionIndex].numQuestions;
    return testData.questions.slice(start, start + count);
  }, [testData, sectionIndex]);

  /* =========================
     LOCK QUESTION INDEX
  ========================== */

  const safeQuestionIndex = Math.min(
    currentQuestion,
    sectionQuestions.length - 1
  );

  const currentQ = sectionQuestions[safeQuestionIndex];

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading section...
      </div>
    );
  }



  /* =========================
     SAFE NEXT HANDLER
  ========================== */

  const handleSafeNext = () => {
    if (safeQuestionIndex < sectionQuestions.length - 1) {
      handleSaveAndNext();
    }
    // ❌ DO NOTHING if section ends
  };


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

      {/* HEADER */}
      <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap">
        <h1 className="text-base font-medium">
          {testData.title}
        </h1>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-cyan-500 text-sm">
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

      {/* SECTION BAR (LOCKED) */}
     <div className="border-b flex items-center px-4 py-2 bg-cyan-500 text-white">
  {/* Left Arrow */}
  <ChevronLeft className="h-5 w-5 opacity-40" />

  {/* Center: Section + Timer */}
  <div className="flex-1 flex flex-col items-center leading-tight">
    <span className="text-sm font-medium">{currentSection}</span>
    <span
      className={`text-xs ${
        sectionTimeLeft < 60 ? "text-red-200" : "text-white/90"
      }`}
    >
      Time Left: {formatTime(sectionTimeLeft)}
    </span>
  </div>

  {/* Right Arrow */}
  <ChevronRight className="h-5 w-5 opacity-40" />
</div>

        
      {/* MAIN */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden gap-4">

        {/* QUESTION AREA */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Question-{currentQuestion + 1}
            </h2>

            <div className="flex items-center gap-2">
              <span className="text-sm">
                Marking:{" "}
                <span className="text-green-600 font-semibold">+4</span>{" "}
                <span className="text-red-600 font-semibold">-1</span>
              </span>

              <Button
                size="sm"
                onClick={handleMarkForReviewAndNext}
                className="border-cyan-500 text-cyan-500"
                variant="outline"
              >
                👁️ Mark for Review
              </Button>

              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* QUESTION */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4">
            {renderWithMath(currentQ.question || currentQ.text)}
          </div>

          {/* OPTIONS */}
          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <label
                key={index}
                className={`flex gap-3 p-3 rounded cursor-pointer border ${
                  answers[currentQ._id] === option
                    ? "bg-green-100 border-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  checked={answers[currentQ._id] === option}
                  onChange={() => handleAnswer(currentQ._id, option)}
                />
                {renderWithMath(option)}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-80 border-l bg-gray-50 p-4 md:p-6 overflow-auto">

          {/* USER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-sm">
              {user?.username || "Student"}
            </span>
          </div>

          {/* STATUS */}
          <h4 className="font-semibold text-sm mb-2">Question Status</h4>

          <div className="grid grid-cols-2 gap-3 text-xs mb-6">
            {[
              ["Not Visited", "bg-white border", statusCounts.notVisited],
              ["Not Answered", "bg-red-500", statusCounts.notAnswered],
              ["Answered", "bg-green-500", statusCounts.answered],
              ["Marked", "bg-purple-400", statusCounts.marked],
            ].map(([label, color, count], i) => (
              <div key={i} className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className={`w-5 h-5 rounded ${color}`}></div>
                  {label}
                </div>
                <b>{count || 0}</b>
              </div>
            ))}
          </div>

          {/* PALETTE (SECTION ONLY) */}
          <h3 className="font-bold text-center mb-3">{currentSection}</h3>

          <div className="grid grid-cols-5 gap-2">
            {sectionQuestions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(i)}
                className={`w-10 h-10 rounded font-semibold ${getQuestionStatusColor(
                  q._id
                )}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t px-4 py-4 flex justify-between">
        <Button
          variant="outline"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion((q) => q - 1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveAndNext}>
            Save & Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Submit Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestView;
