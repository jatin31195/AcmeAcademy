import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const QuestionPalette = ({
  questions = [],
  currentQuestion = 0,
  onSelect = () => {},
  getQuestionStatusColor = () => "",
  studentName = "Student",
  handleSubmit = () => {},
  questionStatus = {},
  answers = {},
}) => {
  const navigate = useNavigate();

  const onSubmit = () => {
    // Evaluate the result
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer === undefined) {
        unattempted++;
      } else if (userAnswer === q.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const positiveMarks = correct * 4;
    const negativeMarks = incorrect;
    const totalScore = positiveMarks - negativeMarks;
    const percentage = (totalScore / (questions.length * 4)) * 100;

    // Navigate to result page with state
    navigate("/acme-test-result", {
      state: {
        questions,
        answers,
        stats: { correct, incorrect, unattempted, positiveMarks, negativeMarks, totalScore, percentage },
      },
    });
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l p-6 overflow-y-auto max-h-screen sticky top-0">
      {/* Student Info */}
      <div className="mb-6 pb-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <p className="font-semibold">{studentName}</p>
        </div>
      </div>

      {/* Section Badge */}
      <Badge className="bg-blue-600 text-white w-full justify-center py-2 mb-4">
        Mathematics
      </Badge>

      {/* Question Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {questions.map((q, i) => (
          <Button
            key={q.id}
            onClick={() => onSelect(i)}
            size="sm"
            className={`h-10 w-10 rounded-full font-semibold text-white ${getQuestionStatusColor(q.id)} ${
              currentQuestion === i ? "ring-2 ring-offset-2 ring-blue-600" : ""
            }`}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Legend / Stats */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-700 rounded">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500"></div>
            <span>Answered</span>
          </div>
          <span className="font-semibold">{Object.values(questionStatus).filter(s => s?.answered).length}</span>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-700 rounded">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-800"></div>
            <span>Not Answered</span>
          </div>
          <span className="font-semibold">
            {questions.filter(q => questionStatus[q.id]?.visited && answers[q.id] === undefined).length}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-700 rounded">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-cyan-400"></div>
            <span>Not Visited</span>
          </div>
          <span className="font-semibold">{questions.filter(q => !questionStatus[q.id]?.visited).length}</span>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-700 rounded">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-pink-500"></div>
            <span>Marked for Review</span>
          </div>
          <span className="font-semibold">{Object.values(questionStatus).filter(s => s?.markedForReview && !s?.answered).length}</span>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-gray-700 rounded">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-500"></div>
            <span>Answered & Marked for review</span>
          </div>
          <span className="text-xs text-muted-foreground">(will be considered for evaluation)</span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg font-semibold mt-4"
      >
        Submit
      </Button>
    </div>
  );
};

export default QuestionPalette;
