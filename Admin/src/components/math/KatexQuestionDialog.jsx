/**
 * KatexQuestionDialog.jsx
 * ----------------------------------------------------------------------------
 * A SEPARATE, self-contained "Add Question" popup built around the visual
 * equation editor. Opened from the "Add Question (Equation Editor)" button.
 *
 * - Independent of the original Add/Edit modal (that one is untouched).
 * - Every field (question, options A–D, answer, solution) has an
 *   "Insert equation" button (MathLive) and a live student-style preview.
 * - Saves to the same practice-question API in the same `$...$` storage format.
 * - Uses the shared axios `api` instance, so requests auto-refresh the admin
 *   token on 401 instead of bouncing the user to login.
 */
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import MathInsertButton from "./MathInsertButton";
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

/**
 * Faithful copy of the student renderer (renderWithMath) so the admin preview
 * shows EXACTLY what students will see — including the `\\` -> `\` collapse.
 */
const renderWithMath = (text) => {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      let math = part.slice(1, -1).trim();
      const isMatrix = /\\begin\{bmatrix\}|\\begin\{pmatrix\}|\\\\/.test(math);
      math = math.replace(/\\\\/g, "\\");
      return isMatrix ? (
        <BlockMath key={i} math={math} />
      ) : (
        <InlineMath key={i} math={math} />
      );
    }
    return <span key={i}>{part}</span>;
  });
};

/** One labelled field = label + "Insert equation" button + input + preview. */
const MathField = ({ label, name, value, multiline, onChange, fieldRefs }) => {
  const setRef = (el) => {
    if (el) fieldRefs.current[name] = el;
  };
  const Comp = multiline ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <MathInsertButton
          getTarget={() => fieldRefs.current[name]}
          value={value}
          onValueChange={(next) => onChange(name, next)}
          label="Insert equation"
        />
      </div>
      <Comp
        ref={setRef}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={`Type ${label.toLowerCase()} — use the button for equations`}
      />
      {value?.includes("$") && (
        <div className="rounded-md bg-muted/40 px-3 py-2 text-sm leading-relaxed">
          <span className="mr-1 text-[11px] font-medium text-indigo-600">
            Preview:
          </span>
          {renderWithMath(value)}
        </div>
      )}
    </div>
  );
};

const KatexQuestionDialog = ({
  open,
  onOpenChange,
  practiceTopicId,
  topics = [],
  onSaved,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fieldRefs = useRef({});

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

    try {
      await api.post("/api/admin/practice-set/topic/q", {
        question: form.question,
        options: [form.optionA, form.optionB, form.optionC, form.optionD],
        answer: form.answer,
        solutionText: form.solutionText,
        topic: form.topic,
        practiceTopic: practiceTopicId,
      });

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
            Add Question — Equation Editor
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <MathField
            label="Question"
            name="question"
            value={form.question}
            onChange={setField}
            fieldRefs={fieldRefs}
            multiline
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MathField label="Option A" name="optionA" value={form.optionA} onChange={setField} fieldRefs={fieldRefs} />
            <MathField label="Option B" name="optionB" value={form.optionB} onChange={setField} fieldRefs={fieldRefs} />
            <MathField label="Option C" name="optionC" value={form.optionC} onChange={setField} fieldRefs={fieldRefs} />
            <MathField label="Option D" name="optionD" value={form.optionD} onChange={setField} fieldRefs={fieldRefs} />
          </div>

          <MathField
            label="Correct Answer"
            name="answer"
            value={form.answer}
            onChange={setField}
            fieldRefs={fieldRefs}
          />

          {/* Topic: pick existing or type a new one */}
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

          <MathField
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
            className="w-full bg-indigo-600 text-white hover:bg-indigo-500 sm:w-auto"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KatexQuestionDialog;
