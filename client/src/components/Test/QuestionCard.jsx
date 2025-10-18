import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const QuestionCard = ({
  question,
  questionIndex,
  totalQuestions,
  answer,
  onAnswer,
  onMarkForReviewAndNext,
  onClearResponse,
  onSaveAndNext,
}) => {
  if (!question) return <div>Loading question...</div>;

  return (
    <MathJaxContext
  config={{
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    },
  }}
>
  <h2 className="text-lg font-bold mb-4">
    Question No. {questionIndex + 1} / {totalQuestions}
  </h2>
  <Card className="mb-6 border-2">
    <CardContent className="pt-6">
      <p className="text-lg mb-6">
        <MathJax dynamic>
          {question.question || question.text || ""}
        </MathJax>
      </p>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-4">Answers:</h4>
        <RadioGroup
          value={answer?.toString()}
          onValueChange={(v) => onAnswer(question._id || question.id, parseInt(v))}
          className="space-y-3"
        >
          {question.options?.map((opt, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent/30"
            >
              <RadioGroupItem value={i.toString()} id={`option-${i}`} />
              <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer text-base">
                <span className="font-medium mr-2">{i + 1}</span>
                <MathJax dynamic>{opt}</MathJax>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </CardContent>
  </Card>

  <div className="flex gap-3 mb-6">
    <Button onClick={onMarkForReviewAndNext} className="bg-green-500 text-white">
      Mark for Review & Next
    </Button>
    <Button onClick={onClearResponse} variant="outline">
      Clear Response
    </Button>
    <Button onClick={onSaveAndNext} className="bg-blue-600 text-white ml-auto">
      Save & Next
    </Button>
  </div>
</MathJaxContext>

  );
};

export default QuestionCard;
