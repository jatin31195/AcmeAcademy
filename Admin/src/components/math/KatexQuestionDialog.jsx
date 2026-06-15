/**
 * KatexQuestionDialog.jsx
 * ----------------------------------------------------------------------------
 * Self-contained Add/Edit popup built around the visual equation editor.
 * Every field has an "Insert equation" button (MathLive) and live preview.
 */
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuestionMathField from "./QuestionMathField";
import { api } from "@/contexts/AuthContext";

const emptyForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: "",
  solutionText: "",
  topic: "",
};

const questionToForm = (q) => ({
  question: q?.question || "",
  optionA: q?.options?.[0] || "",
  optionB: q?.options?.[1] || "",
  optionC: q?.options?.[2] || "",
  optionD: q?.options?.[3] || "",
  answer: q?.answer || "",
  solutionText: q?.solutionText || "",
  topic: q?.topic || "",
});

const KatexQuestionDialog = ({
  open,
  onOpenChange,
  practiceTopicId,
  topics = [],
  onSaved,
  mode = "create",
  questionId = null,
  initialQuestion = null,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fieldRefs = useRef({});

  const isEdit = mode === "edit" && questionId;

  useEffect(() => {
    if (!open) return;
    if (isEdit && initialQuestion) {
      setForm(questionToForm(initialQuestion));
    } else if (!isEdit) {
      setForm(emptyForm);
    }
    setError("");
    fieldRefs.current = {};
  }, [open, isEdit, initialQuestion]);

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const reset = () => {
    setForm(emptyForm);
    setError("");
    fieldRefs.current = {};
  };

  const handleSave = async () => {
    if (!form.question.trim()) {
      setError("Question is required.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      question: form.question,
      options: [form.optionA, form.optionB, form.optionC, form.optionD],
      answer: form.answer,
      solutionText: form.solutionText,
      topic: form.topic,
      practiceTopic: practiceTopicId,
    };

    try {
      if (isEdit) {
        await api.put(`/api/admin/practice-set/topic/q/${questionId}`, payload);
      } else {
        await api.post("/api/admin/practice-set/topic/q", payload);
      }

      reset();
      onOpenChange(false);
      onSaved?.();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to save question. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto bg-[hsl(var(--card))] text-foreground border border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? "Edit Question — Equation Editor" : "Add Question — Equation Editor"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <QuestionMathField
            label="Question"
            name="question"
            value={form.question}
            onChange={setField}
            fieldRefs={fieldRefs}
            multiline
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuestionMathField label="Option A" name="optionA" value={form.optionA} onChange={setField} fieldRefs={fieldRefs} />
            <QuestionMathField label="Option B" name="optionB" value={form.optionB} onChange={setField} fieldRefs={fieldRefs} />
            <QuestionMathField label="Option C" name="optionC" value={form.optionC} onChange={setField} fieldRefs={fieldRefs} />
            <QuestionMathField label="Option D" name="optionD" value={form.optionD} onChange={setField} fieldRefs={fieldRefs} />
          </div>

          <QuestionMathField
            label="Correct Answer"
            name="answer"
            value={form.answer}
            onChange={setField}
            fieldRefs={fieldRefs}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Topic</label>
            <Input
              name="topic"
              list="katex-topic-list"
              value={form.topic}
              onChange={(e) => setField("topic", e.target.value)}
              placeholder="Select an existing topic or type a new one"
            />
            <datalist id="katex-topic-list">
              {topics.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <QuestionMathField
            label="Solution"
            name="solutionText"
            value={form.solutionText}
            onChange={setField}
            fieldRefs={fieldRefs}
            multiline
          />
        </div>

        {error && (
          <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : isEdit ? "Update Question" : "Save Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KatexQuestionDialog;
