import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionDetails from "./QuestionDetail";
import "katex/dist/katex.min.css";

const MainContent = ({
  loading,
  expandedQuestions = [],
  selectedSubject,
  selectedTopic,
  handleOptionClick,
  getOptionStyle,
  showSolution,
  QUESTIONS_PER_PAGE,
}) => {
  const navigate = useNavigate();

  /* ---------------- TAG DETECTION ---------------- */

  const allTags = useMemo(() => {
    return Array.from(
      new Set(expandedQuestions.map((q) => q.tag).filter(Boolean))
    );
  }, [expandedQuestions]);

  const hasTags = allTags.length > 0;

  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------------- AUTO SELECT FIRST TAG ---------------- */

  useEffect(() => {
    if (hasTags && !selectedTag) {
      setSelectedTag(allTags[0]);
      setCurrentPage(1);
    }
  }, [hasTags, allTags, selectedTag]);

  /* ---------------- EFFECTIVE QUESTION LIST ---------------- */

  const effectiveQuestions = useMemo(() => {
    // 🔹 NO TAGS → show all questions
    if (!hasTags) return expandedQuestions;

    // 🔹 TAGS PRESENT → filter by selected tag
    if (!selectedTag) return [];
    return expandedQuestions.filter((q) => q.tag === selectedTag);
  }, [expandedQuestions, selectedTag, hasTags]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(
    effectiveQuestions.length / QUESTIONS_PER_PAGE
  );

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return effectiveQuestions.slice(start, end);
  }, [effectiveQuestions, currentPage, QUESTIONS_PER_PAGE]);

  /* ---------------- PAGINATION HANDLERS ---------------- */

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    } else if (hasTags) {
      // move to next tag
      const currentTagIndex = allTags.indexOf(selectedTag);
      if (currentTagIndex < allTags.length - 1) {
        setSelectedTag(allTags[currentTagIndex + 1]);
        setCurrentPage(1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    } else if (hasTags) {
      // move to previous tag
      const currentTagIndex = allTags.indexOf(selectedTag);
      if (currentTagIndex > 0) {
        const prevTag = allTags[currentTagIndex - 1];
        const prevTagQuestions = expandedQuestions.filter(
          (q) => q.tag === prevTag
        );
        const prevTotalPages = Math.ceil(
          prevTagQuestions.length / QUESTIONS_PER_PAGE
        );

        setSelectedTag(prevTag);
        setCurrentPage(prevTotalPages);
      }
    }
  };

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
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
            Practice Sets
          </h1>

          {selectedSubject && selectedTopic && (
            <div className="flex justify-center gap-2 mt-2">
              <span className="px-4 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                Set: {selectedSubject.title}
              </span>
              <span className="px-4 py-1 text-sm bg-purple-100 text-purple-700 rounded-full">
                Topic: {selectedTopic.name}
              </span>
            </div>
          )}

          {hasTags && selectedTag && (
            <p className="mt-3 text-sm font-medium text-indigo-600">
              Tag: {selectedTag}
            </p>
          )}
        </div>

        {/* 🏷️ TAG SELECTOR (ONLY IF TAGS EXIST) */}
        {hasTags && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${
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
          <p className="text-center text-gray-500">Loading...</p>
        ) : paginatedQuestions.length === 0 ? (
          <p className="text-center text-gray-500">
            No questions available.
          </p>
        ) : (
          <div className="space-y-6">
            {paginatedQuestions.map((item, idx) => {
              const questionNumber =
                (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;

              return (
                <QuestionDetails
                  key={item._id || idx}
                  item={item}
                  idx={idx}
                  handleOptionClick={handleOptionClick}
                  getOptionStyle={getOptionStyle}
                  showSolution={showSolution}
                  mainQuestionNumber={questionNumber}
                />
              );
            })}
          </div>
        )}

        {/* 📄 Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-8">
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>

            <span className="px-3 py-1 bg-muted rounded text-sm">
              {currentPage} / {totalPages}
            </span>

            <Button variant="outline" onClick={handleNext}>
              Next
            </Button>
          </div>
        )}
      </motion.div>
    </main>
  );
};

export default MainContent;
