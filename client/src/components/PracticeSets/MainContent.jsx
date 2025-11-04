import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuestionDetails from "./QuestionDetail";
import "katex/dist/katex.min.css";

const MainContent = ({
  loading,
  paginatedExpanded = [],
  expandedQuestions = [],
  selectedSubject,
  selectedTopic,
  setSearchTerm,
  currentPage,
  totalPages,
  setCurrentPage,
  handleOptionClick,
  getOptionStyle,
  showSolution,
  QUESTIONS_PER_PAGE,
}) => {
  const navigate = useNavigate();

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* 🔙 Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/acme-academy-open-library")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>

        {/* 📘 Header */}
        {/* 📘 Enhanced Header */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="text-center mb-10"
>
  {/* 🎯 Main Heading */}
  <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
    Practice Sets
  </h1>

  {/* 🧠 Context Info */}
  {selectedSubject && selectedTopic ? (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-2">
      <span className="px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full shadow-sm">
        Set: {selectedSubject?.title || "N/A"}
      </span>
      <span className="px-4 py-1 text-sm font-semibold bg-purple-100 text-purple-700 rounded-full shadow-sm">
        Category: {selectedTopic?.name || "N/A"}
      </span>
    </div>
  ) : (
    <p className="text-gray-500 text-sm mt-2">
      Please select a <span className="font-medium text-indigo-600">Practice Set</span> and{" "}
      <span className="font-medium text-pink-500">Category</span> to begin.
    </p>
  )}

  {/* 💡 Subtext / Motivation */}
  <p className="text-gray-600 text-sm mt-4 italic">
    Sharpen your skills one topic at a time — consistency builds mastery.
  </p>

  {/* Decorative Divider */}
  <motion.div
    initial={{ scaleX: 0 }}
    animate={{ scaleX: 1 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mx-auto mt-4 h-[3px] w-32 bg-gradient-to-r from-indigo-400 via-blue-500 to-pink-500 rounded-full"
  />
</motion.div>


        

        {/* 📚 Questions Section */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : !Array.isArray(paginatedExpanded) ||
          paginatedExpanded.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            
          </p>
        ) : (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {paginatedExpanded.map((item, idx) => {
              const mainQuestionNumber =
                (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;
              let parentMainNumber = null;
              let subIndex = null;

              if (item.isSub && item.parentId) {
                const parent = expandedQuestions.find(
                  (q) => q._id === item.parentId
                );
                if (parent && Array.isArray(parent.subQuestions)) {
                  subIndex = parent.subQuestions.findIndex(
                    (sub) => sub.question === item.question
                  );
                }
                const parentExpandedIndex = expandedQuestions.findIndex(
                  (q) => q._id === item.parentId
                );
                parentMainNumber = parentExpandedIndex + 1;
              }

              return (
                <QuestionDetails
                  key={item._id || `${item.parentId}-${idx}`}
                  item={item}
                  idx={idx}
                  currentPage={currentPage}
                  QUESTIONS_PER_PAGE={QUESTIONS_PER_PAGE}
                  handleOptionClick={handleOptionClick}
                  getOptionStyle={getOptionStyle}
                  showSolution={showSolution}
                  mainQuestionNumber={
                    item.isSub ? parentMainNumber : mainQuestionNumber
                  }
                  subIndex={item.isSub ? subIndex : null}
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
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 bg-muted rounded text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
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
