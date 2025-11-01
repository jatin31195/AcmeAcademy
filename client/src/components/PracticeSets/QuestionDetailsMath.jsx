import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
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
        .replace(/\\int(?![a-zA-Z])/g, " \\int ")
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
        .replace(/\\subset/g, " \\subset ")
        .replace(/\\supset/g, " \\supset ")
        .replace(/\\cup/g, " \\cup ")
        .replace(/\\cap/g, " \\cap ")
        .replace(/\\in(?!t)/g, " \\in ")
        .replace(/\\notin/g, " \\notin ")
        .replace(/\\emptyset/g, " \\emptyset ")
        .replace(/\\phi/g, " \\phi ")
        .replace(/\\bigcup/g, " \\bigcup ")
        .replace(/\\bigcap/g, " \\bigcap ");
        
      return <InlineMath key={i} math={math} />;
    }

  
    return <span key={i}>{part}</span>;
  });
};

const MathQuestionDetails = ({
  item,
  idx,
  currentPage,
  QUESTIONS_PER_PAGE,
  handleOptionClick,
  getOptionStyle,
  showSolution,
  mainQuestionNumber,
  subIndex,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isSub = item.isSub;
  const uniqueId = isSub ? `${item.parentId}-${idx}` : item._id;

  const isImageUrl = (str) =>
    typeof str === "string" &&
    str.match(/\.(jpeg|jpg|png|gif|webp)$/i) &&
    str.startsWith("http");

  return (
    <Card
      key={uniqueId}
      className={`border border-border mb-4 relative overflow-hidden ${
        isSub ? "bg-gray-50" : ""
      }`}
    >
      <CardContent className="space-y-3 pt-4 relative">
        <img
          src="/logo.png"
          alt="Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-42 h-42 object-contain z-0"
        />

        <div className="relative z-10">
          {isSub && (
            <p className="text-sm text-gray-500 mb-1">
              From: {item.parentTopic} →{" "}
              {renderWithMath(item.parentQuestion?.replace(/\\n/g, " "))}
            </p>
          )}

          {/* 🧮 Question */}
          <p className="font-medium mb-2 flex flex-wrap items-baseline">
            <span className="mr-1">
              {item.isSub
                ? `Q${mainQuestionNumber}${String.fromCharCode(
                    97 + (subIndex || 0)
                  )})`
                : `Q${mainQuestionNumber}.`}
            </span>
            <span>{renderWithMath(item.question?.replace(/\\n/g, " "))}</span>
          </p>

          {/* 🖼️ Question Image */}
          {item.image && (
            <div className="w-full flex justify-center mb-2">
              <img
                src={item.image}
                alt="Question"
                className="rounded-lg border shadow-sm max-w-sm object-contain"
              />
            </div>
          )}

          {/* 🔘 Options */}
          {item.options?.length > 0 && (
            <div className="space-y-2">
              {item.options.map((opt, i) => {
                let optionText = "";
                let optionImage = "";

                if (typeof opt === "object") {
                  optionText = opt.text || "";
                  optionImage = opt.image || "";
                } else if (typeof opt === "string") {
                  if (isImageUrl(opt)) optionImage = opt;
                  else optionText = opt;
                }

                const optionValue = optionText || optionImage;

                return (
                  <div
                    key={i}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col gap-2 ${getOptionStyle(
                      uniqueId,
                      item.answer,
                      optionValue
                    )}`}
                    onClick={() =>
                      handleOptionClick(
                        uniqueId,
                        optionValue,
                        item.answer,
                        item.solutionText,
                        item.solutionImage,
                        item.solutionVideo
                      )
                    }
                  >
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-medium">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <div className="text-sm">{renderWithMath(optionText)}</div>
                      {optionImage && (
                        <img
                          src={optionImage}
                          alt={`Option ${i + 1}`}
                          className="rounded-lg border shadow-sm max-h-16 object-contain"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 💡 Solution Section */}
        {showSolution[uniqueId]?.show && (
          <div className="mt-3 p-3 rounded bg-blue-50 border border-blue-300 text-sm space-y-3">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-green-600">
                ✅ Correct Answer:
              </span>

              {isImageUrl(showSolution[uniqueId]?.correctAnswer) ? (
                <div className="flex justify-center">
                  <img
                    src={showSolution[uniqueId]?.correctAnswer}
                    alt="Correct Answer"
                    className="rounded-lg border shadow-sm max-w-xs object-contain"
                  />
                </div>
              ) : (
                <span className="font-semibold text-green-700">
                  {renderWithMath(showSolution[uniqueId]?.correctAnswer || "")}
                </span>
              )}
            </div>

            <div className="text-gray-700 space-y-3">
              {showSolution[uniqueId]?.solutionText && (
                <p>
                  🧠 Explanation:{" "}
                  {renderWithMath(showSolution[uniqueId]?.solutionText || "")}
                </p>
              )}

              {showSolution[uniqueId]?.solutionImage && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={showSolution[uniqueId]?.solutionImage}
                    alt="Solution"
                    className="rounded-lg shadow-md border border-gray-200 max-w-full"
                  />
                </div>
              )}

              {showSolution[uniqueId]?.solutionVideo && (
                <div className="mt-3 flex justify-center">
                  <video
                    src={showSolution[uniqueId]?.solutionVideo}
                    controls
                    className="rounded-lg border border-gray-300 max-w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MathQuestionDetails;
