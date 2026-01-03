import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionDetails from "./QuestionDetail";
import "katex/dist/katex.min.css";

const MainContent = ({
  loading,
  paginatedExpanded = [],
  expandedQuestions = [],
  selectedSubject,
  selectedTopic,
  currentPage,
  totalPages,
  setCurrentPage,
  handleOptionClick,
  getOptionStyle,
  showSolution,
  QUESTIONS_PER_PAGE,
}) => {
  const navigate = useNavigate();

  /* ---------------- TAG LOGIC ---------------- */

  const allTags = useMemo(() => {
    return Array.from(
      new Set(expandedQuestions.map((q) => q.tag).filter(Boolean))
    );
  }, [expandedQuestions]);

  const [selectedTag, setSelectedTag] = useState(null);

  // auto-select first tag when data loads
  useEffect(() => {
    if (!selectedTag && allTags.length > 0) {
      setSelectedTag(allTags[0]);
    }
  }, [allTags, selectedTag]);

  /* ---------------- RENDER ---------------- */

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🔙 Back */}
        <Button
          variant="ghost"
          onClick={() => navigate("/acme-academy-open-library")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>

        {/* 📘 Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
            Practice Sets
          </h1>

          {selectedSubject && selectedTopic && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                Set: {selectedSubject.title}
              </span>
              <span className="px-4 py-1 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full">
                Category: {selectedTopic.name}
              </span>
            </div>
          )}

          {selectedTag && (
            <p className="mt-3 text-sm font-medium text-indigo-600">
              Tag: {selectedTag}
            </p>
          )}

          <p className="text-gray-600 text-sm mt-2 italic">
            Sharpen your skills one topic at a time — consistency builds mastery.
          </p>

          <div className="mx-auto mt-4 h-[3px] w-32 bg-gradient-to-r from-indigo-400 via-blue-500 to-pink-500 rounded-full" />
        </motion.div>

        {/* 🏷️ TAG SELECTOR */}
        {allTags.length > 0 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1 rounded-full text-sm font-semibold border transition ${
                  selectedTag === tag
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 📚 QUESTIONS */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {paginatedExpanded
              .filter((q) => !selectedTag || q.tag === selectedTag)
              .map((item, idx) => {
                const mainQuestionNumber =
                  (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;

                return (
                  <QuestionDetails
                    key={item._id || idx}
                    item={item}
                    idx={idx}
                    handleOptionClick={handleOptionClick}
                    getOptionStyle={getOptionStyle}
                    showSolution={showSolution}
                    mainQuestionNumber={mainQuestionNumber}
                  />
                );
              })}
          </motion.div>
        )}

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 bg-muted rounded text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  );
};

export default MainContent;
