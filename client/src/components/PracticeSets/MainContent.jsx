import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import QuestionDetails from "./QuestionDetail";
import { useNavigate } from "react-router-dom";

const MainContent = ({
  loading,
  paginatedExpanded,
  expandedQuestions,
  selectedSubject,
  selectedTopic,
  searchTerm,
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/acme-academy-open-library")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Practice Sets
          </h1>
          {selectedSubject && selectedTopic && (
            <p className="text-muted-foreground text-sm">
              Subject: {selectedSubject?.name} | Topic: {selectedTopic?.name}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Questions List */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : paginatedExpanded.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No questions found.
          </p>
        ) : (
          paginatedExpanded.map((item, idx) => {
            const mainQuestionNumber =
              (currentPage - 1) * QUESTIONS_PER_PAGE + idx + 1;
            let parentMainNumber = null;
            let subIndex = null;

            if (item.isSub && item.parentId) {
              const parent = expandedQuestions.find(
                (q) => q._id === item.parentId
              );
              if (parent && Array.isArray(parent.subQuestions)) {
                const siblingIndex = parent.subQuestions.findIndex(
                  (sub) => sub.question === item.question
                );
                subIndex = siblingIndex;
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
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 bg-muted rounded">
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
