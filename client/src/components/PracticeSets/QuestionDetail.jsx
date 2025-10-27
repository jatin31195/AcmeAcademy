// src/components/QuestionDetails.jsx
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
}) => {
  const [expanded, setExpanded] = useState(false);
  const isSub = item.isSub;
  const uniqueId = isSub ? `${item.parentId}-${idx}` : item._id;

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
              From: {item.parentTopic} → {item.parentQuestion}
            </p>
          )}
          <p className="font-medium mb-2">
            Q{(currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1}. {item.question}
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

          {/* 🧩 Options */}
          {item.options?.length > 0 && (
            <div className="space-y-2">
              {item.options.map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border cursor-pointer transition-all ${getOptionStyle(
                    uniqueId,
                    item.answer,
                    opt
                  )}`}
                  onClick={() =>
                    handleOptionClick(
                      uniqueId,
                      opt,
                      item.answer,
                      item.solutionText,
                      item.solutionImage,
                      item.solutionVideo
                    )
                  }
                >
                  <span className="font-semibold mr-2">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Solution Section */}
        {showSolution[uniqueId]?.show && (
          <div className="mt-3 p-3 rounded bg-blue-50 border border-blue-300 text-sm space-y-2">
            <p className="font-semibold text-green-600">
              ✅ Correct Answer: {showSolution[uniqueId]?.correctAnswer}
            </p>

            {showSolution[uniqueId]?.solutionText ? (
              <p className="text-gray-700">
                🧠 Explanation: {showSolution[uniqueId]?.solutionText}
              </p>
            ) : showSolution[uniqueId]?.solutionImage ||
              showSolution[uniqueId]?.solutionVideo ? null : (
              <p className="text-gray-700">
                🧠 Explanation: No explanation available.
              </p>
            )}

            {showSolution[uniqueId]?.solutionImage && (
              <div className="w-full flex justify-center">
                <img
                  src={showSolution[uniqueId]?.solutionImage}
                  alt="Solution"
                  className="rounded-lg border shadow-md max-w-sm object-contain"
                />
              </div>
            )}

            {showSolution[uniqueId]?.solutionVideo && (
              <div className="w-full flex justify-center mt-3">
                <video
                  controls
                  className="rounded-lg border shadow-md max-w-md"
                >
                  <source
                    src={showSolution[uniqueId]?.solutionVideo}
                    type="video/mp4"
                  />
                </video>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionDetails;
