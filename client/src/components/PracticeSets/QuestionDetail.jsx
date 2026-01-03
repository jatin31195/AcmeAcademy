import { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineMath ,BlockMath} from "react-katex";
import "katex/dist/katex.min.css";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, Smile, MessageSquare } from "lucide-react";
import { BASE_URL } from "@/config";
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
const renderSolutionWithParagraphs = (text) => {
  if (!text) return null;

  // split by blank lines
  const paragraphs = text.split(/\n\s*\n/);

  return paragraphs.map((para, idx) => (
    <p key={idx} className="leading-relaxed text-gray-800">
      {renderWithMath(para)}
    </p>
  ));
};

const QuestionDetails = ({
  item,
  idx,
  handleOptionClick,
  getOptionStyle,
  mainQuestionNumber,
  subIndex,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [discussionExpanded, setDiscussionExpanded] = useState(false);
  const [highlightCorrect, setHighlightCorrect] = useState(false);
  const [discussion, setDiscussion] = useState(item.discussion || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isSub = item.isSub;
  const uniqueId = isSub ? `${item.parentId}-${idx}` : item._id;
  console.log(item)
  const isImageUrl = (str) =>
    typeof str === "string" &&
    str.match(/\.(jpeg|jpg|png|gif|webp)$/i) &&
    str.startsWith("http");

  const isCorrectOption = (optionValue) =>
    highlightCorrect &&
    item.answer &&
    optionValue?.toString().trim() === item.answer?.toString().trim();


  const handleAddDiscussion = async () => {
    if (!newComment.trim()) return;
    try {
      setLoading(true);
      const res = await axios.patch(
  `${BASE_URL}/api/questions/${item._id}/discussion`,
  {
    user: "Anonymous User",
    comment: newComment.trim(),
  }
);

      setDiscussion(res.data.discussion);
      setNewComment("");
    } catch (err) {
      toast.error("Failed to add discussion", err);
      alert("Failed to add discussion. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      key={uniqueId}
      className={`border border-border mb-4 relative overflow-hidden transition-all duration-300 ${
        isSub ? "bg-gray-50" : "bg-white"
      }`}
    >
      <CardContent className="space-y-3 pt-4 relative">
        {/* Background Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-42 h-42 object-contain z-0"
        />

        <div className="relative z-10">
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
                const correctHighlightClass = isCorrectOption(optionValue)
                  ? "border-green-500 bg-green-50"
                  : "";

                return (
                  <div
                    key={i}
                    className={`p-3 rounded border cursor-pointer transition-all flex flex-col gap-2 ${getOptionStyle(
                      uniqueId,
                      item.answer,
                      optionValue
                    )} ${correctHighlightClass}`}
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

        {/* 🧩 Buttons */}
        <div className="flex gap-3 pt-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setExpanded((prev) => !prev);
              setHighlightCorrect((prev) => !prev);
            }}
            className={`flex items-center gap-2 ${
              expanded ? "bg-green-100 border-green-500 text-green-700" : ""
            }`}
          >
            <BookOpen size={16} />
            {expanded ? "Hide Solution" : "View Solution"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setVideoExpanded((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <Play size={16} />
            {videoExpanded ? "Hide Video" : "Video Solution"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDiscussionExpanded((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <MessageSquare size={16} />
            {discussionExpanded ? "Hide Discussion" : "View Discussion"}
          </Button>
        </div>

        {/* 💡 Solution Section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded bg-blue-50 border border-blue-300 text-sm space-y-3"
            >
              {item.solutionText || item.solutionImage ? (
                <>
                  <div className="text-gray-800 text-sm space-y-3">
  <p className="font-medium flex items-center gap-2">
    🧠 Explanation:
  </p>

  {renderSolutionWithParagraphs(item.solutionText)}
</div>

                  {item.solutionImage && (
                    <div className="flex justify-center mt-2">
                      <img
                        src={item.solutionImage}
                        alt="Solution"
                        className="rounded-lg shadow-md border border-gray-200 max-w-full"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 italic">
                  <Smile className="text-green-600" />
                  <span>
                    Will be added soon! Be in touch 😊 Happy Preparation —{" "}
                    <span className="font-semibold text-blue-600">
                      All the Best, ACME Academy!
                    </span>
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎥 Video Solution */}
       {/* 🎥 Video Solution */}
<AnimatePresence>
  {videoExpanded && (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.3 }}
      className="mt-3 p-4 rounded bg-purple-50 border border-purple-300 text-sm"
    >
      {item.solutionVideo ? (
        <div className="flex justify-center">
          <video
            src={item.solutionVideo}
            controls
            className="rounded-lg border border-gray-300 max-w-full"
          />
        </div>
      ) : (
        <div className="flex items-start gap-3 text-purple-700">
          <Play className="mt-1" />
          <div>
            <p className="font-semibold">
              Video Solution Coming Soon 🎥
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Our faculty at <span className="font-semibold">ACME Academy</span> is
              preparing a detailed video explanation for this question.
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Stay updated and keep practicing — success is on the way 🚀
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )}
</AnimatePresence>


        {/* 💬 Discussion Section */}
        <AnimatePresence>
          {discussionExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-300 text-sm space-y-3"
            >
              <p className="font-semibold text-yellow-800 flex items-center gap-2">
                <MessageSquare size={16} />
                Discussion Board
              </p>

              {/* Existing Comments */}
              {discussion.length > 0 ? (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {discussion.map((d, i) => (
                    <div
                      key={i}
                      className="border p-2 rounded bg-white shadow-sm text-gray-700"
                    >
                      <p className="font-medium text-blue-700">
                        {d.user || "Anonymous"}:
                      </p>
                      <p>{d.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-500">
                  Be the first to discuss this question!
                </p>
              )}

              {/* Add New Comment */}
              <div className="flex gap-2 mt-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1"
                />
                <Button
                  size="sm"
                  disabled={loading}
                  onClick={handleAddDiscussion}
                >
                  {loading ? "Posting..." : "Post"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default QuestionDetails;
