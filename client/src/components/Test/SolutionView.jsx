import { useState } from "react";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useAuth } from "@/AuthContext";

const SolutionView = ({ results, onExit }) => {
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const sections = results.sections || [];
  const currentSection = sections[currentSectionIndex];
  const questions = currentSection?.questions || [];
  const currentQ = questions[currentQuestionIndex];

  if (!currentQ) return <div>Loading question...</div>;

 
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  
    const renderWithMath = (text) => {
  if (!text) return "No question text";

  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, i) => {
    // Handle math segments ($...$)
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


  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(0);
    }
  };
  const nextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  // Question palette
  const getResultClass = (q) => {
    if (q.result === "correct") return "bg-green-500 text-white";
    if (q.result === "wrong") return "bg-red-500 text-white";
    return "bg-white border-2 border-gray-300 text-gray-700";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <div className="border-b px-4 py-3 flex items-center justify-between flex-wrap">
        <h1 className="text-base font-medium">
          {results.testTitle} | {currentSection?.title || "Section"}
        </h1>
        <div className="text-sm text-gray-600 mt-2 md:mt-0">
          ⏱️ Total Time: {formatTime(results.totalTimeTaken || 0)}
        </div>
      </div>

    
      {sections.length > 1 && (
        <div className="border-b flex items-center justify-between px-4 py-2 bg-cyan-500 text-white">
          <ChevronLeft
            className={`h-5 w-5 cursor-pointer ${currentSectionIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={prevSection}
          />
          <span className="text-sm font-medium">{currentSection?.title}</span>
          <ChevronRight
            className={`h-5 w-5 cursor-pointer ${currentSectionIndex === sections.length - 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={nextSection}
          />
        </div>
      )}

    
      <div className="flex flex-1 md:flex-row flex-col overflow-hidden gap-4">
    
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="mb-4 flex items-center justify-between flex-wrap">
            <h2 className="text-lg font-semibold">Question-{currentQuestionIndex + 1}</h2>
            <span className="text-sm text-gray-500">
              ⏱️ Time: {formatTime(currentQ.timeTaken || 0)}
            </span>
          </div>

      
          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-4 text-gray-800 leading-relaxed">
            {renderWithMath(currentQ.questionText)}
          </div>

       
          <div className="space-y-2 mb-4">
            {currentQ.options.map((option, idx) => {
              const isUserAnswer = currentQ.userAnswer === option;
              const isCorrectOption = currentQ.correctAnswer === option;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded border ${
                    isCorrectOption
                      ? "bg-green-100 border-green-500"
                      : isUserAnswer
                      ? "bg-red-100 border-red-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {isCorrectOption && <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />}
                  {isUserAnswer && !isCorrectOption && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                  {!isCorrectOption && !isUserAnswer && <div className="w-5 h-5 mt-0.5" />}
                  <span className="flex-1">{renderWithMath(option)}</span>
                </div>
              );
            })}
          </div>

          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Solution / Explanation</h4>
            <p className="text-sm text-gray-700 mb-1">
              ✅ Correct Answer: {renderWithMath(currentQ.correctAnswer)}
            </p>
            <p className={`text-sm mb-2 ${currentQ.userAnswer == null ? "text-gray-600" : "text-blue-600"}`}>
              {currentQ.userAnswer == null
                ? "⚪ You did not attempt this question."
                : <>🟢 You selected: <span className="font-medium">{renderWithMath(currentQ.userAnswer)}</span></>}
            </p>
            <p className="text-sm text-gray-600 italic">{currentQ.solution?.text || "Explanation not available."}</p>
          </div>
        </div>

   
        <div className="w-full md:w-80 border-l bg-gray-50 p-4 md:p-6 overflow-auto flex-shrink-0">
     
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="font-semibold text-sm">{user?.username || "Student"}</span>
          </div>

      
          <div className="space-y-2 text-xs mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-green-500"></div>
                <span>Correct</span>
              </div>
              <span className="font-bold">{currentSection.stats.correct}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-red-500"></div>
                <span>Incorrect</span>
              </div>
              <span className="font-bold">{currentSection.stats.incorrect}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-gray-300"></div>
                <span>Unattempted</span>
              </div>
              <span className="font-bold">{currentSection.stats.unattempted}</span>
            </div>
          </div>

          
          <h3 className="font-bold text-center mb-3">{currentSection.title}</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((q, i) => (
              <button
                key={q.questionId}
                onClick={() => setCurrentQuestionIndex(i)}
                className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold transition-all ${getResultClass(q)} ${currentQuestionIndex === i ? "ring-2 ring-cyan-500 ring-offset-2" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button onClick={onExit} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white mt-4">
            View Summary
          </Button>
        </div>
      </div>

      <div className="border-t px-4 py-4 flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => currentQuestionIndex > 0 && setCurrentQuestionIndex(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => currentQuestionIndex < questions.length - 1 && setCurrentQuestionIndex(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === questions.length - 1}
          className="border-cyan-500 text-cyan-500 hover:bg-cyan-50"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SolutionView;
