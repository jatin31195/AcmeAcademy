import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const QuestionDetails = ({
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


  const replaceFractions = (text) => {
    if (!text) return text;
    return text
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-div-(\d+)by(\d+)\.gif/gi,
        (_, num, den) => `${num}/${den}`
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-oparen-h1\.gif/gi,
        "("
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-cparen-h1\.gif/gi,
        ")"
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-times-h1\.gif/gi,
        "×"
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-plus-h1\.gif/gi,
        "+"
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-minus-h1\.gif/gi,
        "-"
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-equal-h1\.gif/gi,
        "="
      )
      .replace(
        /https:\/\/www\.indiabix\.com\/_files\/images\/aptitude\/1-sym-div-h1\.gif/gi,
        "÷"
      )
      .replace(/https?:\/\/[^\s]+/g, "")
      .replace(/\[|\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

const renderMathText = (text) => {
  if (!text) return null;
  text = text.replace(/\s+/g, " ").trim();

  // ✅ Updated token pattern — now supports π, sin, cos, tan, and mixed forms
  const tokens =
    /sin|cos|tan|π|[a-zA-Z]+\([^)]*\)\^\d+|\([^()]+\)\^\d+|√\([^)]*\)|√\d+|[a-zA-Z0-9π√]+\/[a-zA-Z0-9π√]+|\d+\s+\d+\/\d+|\d+\/\d+|[a-zA-Z]+\([^)]*\)|[a-zA-Z]+|\d+|[=()^_+\-×÷]|[^\s]+/g;

  const parts = [];
  let match;
  while ((match = tokens.exec(text)) !== null) parts.push(match[0]);

  const renderFraction = (num, den, key) => (
    <span
      key={key}
      className="flex flex-col items-center justify-center mx-0.5 text-sm"
      style={{ lineHeight: "1.1em" }}
    >
      <span className="border-b border-gray-600 px-1 leading-none">
        {renderMathText(num)}
      </span>
      <span className="leading-none">{renderMathText(den)}</span>
    </span>
  );

  return (
    <span className="flex items-center flex-wrap">
      {parts.map((part, i) => {
        // ✅ Square root √(...)
        if (part.startsWith("√")) {
          const inner = part.startsWith("√(")
            ? part.slice(2, -1)
            : part.slice(1);
          return (
            <span key={i} className="flex items-center mx-0.5">
              √
              <span className="border-t border-gray-600 px-1">
                {renderMathText(inner)}
              </span>
            </span>
          );
        }

        // ✅ Handle exponents like x^2, (x-1)^2, π^2
        const power = part.match(/^(.+)\^(\d+)$/);
        if (power) {
          const [, base, exp] = power;
          return (
            <span
              key={i}
              className="inline-flex items-baseline mx-0.5"
              style={{ lineHeight: "1.2em" }}
            >
              {renderMathText(base)}
              <sup
                className="text-[0.75em] ml-0.5 relative"
                style={{ top: "-0.55em" }}
              >
                {exp}
              </sup>
            </span>
          );
        }

        // ✅ Handle trig functions like sin(x), cos(π/2)
        if (part.match(/^(sin|cos|tan)\([^()]*\)$/)) {
          const fn = part.match(/^(sin|cos|tan)/)[1];
          const inner = part.match(/\(([^()]*)\)/)[1];
          return (
            <span key={i} className="flex items-center mx-1">
              {fn}
              <span>(</span>
              {renderMathText(inner)}
              <span>)</span>
            </span>
          );
        }

        // ✅ Handle algebraic functions like f(x)
        if (part.match(/^[a-zA-Z]+\([^()]*\)$/)) {
          const name = part.match(/^([a-zA-Z]+)\(/)[1];
          const inner = part.match(/\(([^()]*)\)/)[1];
          return (
            <span key={i} className="flex items-center mx-1">
              {name}(
              {renderMathText(inner)})
            </span>
          );
        }

        // ✅ Fractions like (a+b)/(c−d)
        const parenFrac = part.match(/^\(([^()]*)\)\/\(([^()]*)\)$/);
        if (parenFrac) {
          const [, num, den] = parenFrac;
          return renderFraction(num, den, i + "-pf");
        }

        // ✅ Mixed numbers like 5 2/3
        const mixed = part.match(/^(\d+)\s+(\d+)\/(\d+)$/);
        if (mixed) {
          const [, whole, num, den] = mixed;
          return (
            <span key={i} className="flex items-center mx-1">
              <span>{whole}</span>
              {renderFraction(num, den, i + "-mix")}
            </span>
          );
        }

        // ✅ Simple fractions like π/2 or 2π/3
        const algebraicFrac = part.match(/^([^/]+)\/([^/]+)$/);
        if (algebraicFrac && !part.includes("http")) {
          const [, num, den] = algebraicFrac;
          return renderFraction(num, den, i + "-frac");
        }

        // ✅ Default
        return (
          <span key={i} className="mx-0.5">
            {part}
          </span>
        );
      })}
    </span>
  );
};

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
            <p className="text-sm text-gray-500 mb-1 whitespace-pre-line">
              From: {item.parentTopic} →{" "}
              {item.parentQuestion.replace(/\\n/g, "\n")}
            </p>
          )}

          {/* Question */}
          <p className="font-medium mb-2 flex flex-wrap items-baseline">
            <span className="mr-1">
              {item.isSub
                ? `Q${mainQuestionNumber} ${String.fromCharCode(
                    97 + (subIndex || 0)
                  )})`
                : `Q${mainQuestionNumber}.`}
            </span>
            <span>
              {renderMathText(replaceFractions(item.question?.replace(/\\n/g, " ")))}
            </span>
          </p>

          {/* Question Image */}
          {item.image && (
            <div className="w-full flex justify-center mb-2">
              <img
                src={item.image}
                alt="Question"
                className="rounded-lg border shadow-sm max-w-sm object-contain"
              />
            </div>
          )}

          {/* Options */}
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

                      <div className="text-sm">
                        {renderMathText(replaceFractions(optionText))}
                      </div>

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

        {/* Solution Section */}
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
                  {renderMathText(
                    replaceFractions(showSolution[uniqueId]?.correctAnswer)
                  )}
                </span>
              )}
            </div>

            <div className="text-gray-700 space-y-3">
              {showSolution[uniqueId]?.solutionText && (
                <p>
                  🧠 Explanation:{" "}
                  {renderMathText(
                    replaceFractions(showSolution[uniqueId]?.solutionText)
                  )}
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

export default QuestionDetails;
