import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Pencil, Sigma, Eye, EyeOff } from "lucide-react";
import KatexQuestionDialog from "@/components/math/KatexQuestionDialog";
import QuestionMathField from "@/components/math/QuestionMathField";
import { renderWithMath, hasMath } from "@/lib/renderWithMath";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "katex/dist/katex.min.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/config";

const QUESTION_API = `${BASE_URL}/api/admin/practice-set/topic/q`;

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

/* One field: raw KaTeX source + its OWN independent show/hide math preview.
   Defined at module scope so each instance keeps its own toggle state. */
const FieldWithPreview = ({ label, text, tone = "default", emphasize = false }) => {
  const [show, setShow] = useState(false);
  if (text === undefined || text === null || text === "") return null;

  const toneClasses =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : tone === "info"
      ? "border-blue-500/30 bg-blue-500/5"
      : "border-border bg-secondary/50";

  return (
    <div className={cn("rounded-lg border px-3 py-2.5", toneClasses)}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          {show ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Hide preview
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Show Maths preview
            </>
          )}
        </button>
      </div>

      {/* Raw KaTeX / source */}
      <code className="block whitespace-pre-wrap break-words font-mono text-xs text-foreground/80">
        {text}
      </code>

      {/* This field's own rendered math preview */}
      {show && (
        <div className="mt-2 border-t border-border/50 pt-2">
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Preview
          </span>
          <div className={cn("text-sm leading-relaxed", emphasize && "font-medium")}>
            {hasMath(text) ? renderWithMath(text) : text}
          </div>
        </div>
      )}
    </div>
  );
};

const PracticeQuestionPage = () => {
  const { practiceTopicId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [useNewTopic, setUseNewTopic] = useState(false);

  const [open, setOpen] = useState(false);
  const [katexOpen, setKatexOpen] = useState(false);
  const [katexMode, setKatexMode] = useState("create");
  const [katexQuestion, setKatexQuestion] = useState(null);
  const [katexQuestionId, setKatexQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fieldRefs = useRef({});

  // ✅ NEW (edit support)
  const [mode, setMode] = useState("create"); // create | edit
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH TOPICS ---------------- */
  const fetchTopics = async () => {
    try {
      const res = await fetch(
        `${QUESTION_API}/practice-topic/${practiceTopicId}/topics`,
        { credentials: "include" }
      );
      const json = await res.json();
      setTopics(Array.isArray(json.data) ? json.data : []);
    } catch {
      setTopics([]);
    }
  };

  /* ---------------- FETCH QUESTIONS ---------------- */
  const fetchQuestions = async (topic = "") => {
    try {
      const url = topic
        ? `${QUESTION_API}/practice-topic/${practiceTopicId}/topics/${topic}`
        : `${QUESTION_API}?practiceTopic=${practiceTopicId}`;

      const res = await fetch(url, { credentials: "include" });
      const json = await res.json();

      setQuestions(Array.isArray(json.data) ? json.data : []);
    } catch {
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, [practiceTopicId]);

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const openKatexCreate = () => {
    setKatexMode("create");
    setKatexQuestion(null);
    setKatexQuestionId(null);
    setKatexOpen(true);
  };

  const openKatexEdit = (q) => {
    setKatexMode("edit");
    setKatexQuestion(q);
    setKatexQuestionId(q._id);
    setKatexOpen(true);
  };

  /* ---------------- OPEN EDIT ---------------- */
  const openEdit = (q) => {
    setMode("edit");
    setCurrentId(q._id);

    setForm({
      question: q.question || "",
      optionA: q.options?.[0] || "",
      optionB: q.options?.[1] || "",
      optionC: q.options?.[2] || "",
      optionD: q.options?.[3] || "",
      answer: q.answer || "",
      solutionText: q.solutionText || "",
      topic: q.topic || "",
    });

    setUseNewTopic(false);
    fieldRefs.current = {};
    setOpen(true);
  };

  /* ---------------- ADD / UPDATE QUESTION ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      question: form.question,
      options: [
        form.optionA,
        form.optionB,
        form.optionC,
        form.optionD,
      ],
      answer: form.answer,
      solutionText: form.solutionText,
      topic: form.topic,
      practiceTopic: practiceTopicId,
    };

    const url =
      mode === "create"
        ? QUESTION_API
        : `${QUESTION_API}/${currentId}`;

    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save question");
      setLoading(false);
      return;
    }

    setForm(emptyForm);
    setMode("create");
    setCurrentId(null);
    setOpen(false);
    setLoading(false);

    fetchQuestions(selectedTopic);
    fetchTopics();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;

    await fetch(`${QUESTION_API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchQuestions(selectedTopic);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Practice Questions"
        description="Manage questions under this practice category"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => {
              setMode("create");
              setForm(emptyForm);
              fieldRefs.current = {};
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>

          <Button
            variant="outline"
            className="border-primary/40 text-primary hover:bg-primary/10"
            onClick={openKatexCreate}
          >
            <Sigma className="h-4 w-4 mr-2" />
            Add Question (Equation Editor)
          </Button>
        </div>
      </PageHeader>
             {topics.length > 0 && (
        <div className="mb-4">
          <select
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 cursor-pointer sm:w-auto"
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              fetchQuestions(e.target.value);
            }}
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* ---------------- QUESTION LIST ---------------- */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div
  key={q._id}
  className="
    group
    rounded-2xl
    border border-border
    bg-card
    shadow-sm
    transition
    hover:shadow-md
    hover:border-primary/40
  "
>
  {/* ---------- HEADER ---------- */}
  <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="space-y-1">
      <Badge
        variant="secondary"
        className="bg-primary/10 text-primary border-primary/20"
      >
        Topic: {q.topic || "General"}
      </Badge>
      <p className="text-xs text-muted-foreground">
        Question ID: {q._id.slice(-6)}
      </p>
    </div>

    <div className="flex flex-wrap gap-2 opacity-90 group-hover:opacity-100">
      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1"
        onClick={() => openEdit(q)}
      >
        <Pencil className="h-4 w-4" />
        Edit
      </Button>

      <Button
        size="sm"
        variant="outline"
        className="flex items-center gap-1 border-primary/40 text-primary hover:bg-primary/10"
        onClick={() => openKatexEdit(q)}
      >
        <Sigma className="h-4 w-4" />
        Equation Editor
      </Button>

      <Button
        size="sm"
        className="bg-red-600 hover:bg-red-500 text-white flex items-center gap-1"
        onClick={() => handleDelete(q._id)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  </div>

  {/* ---------- QUESTION BODY ---------- */}
  {/* Each field shows raw KaTeX + its OWN independent preview toggle. */}
  <div className="px-5 py-4 space-y-4">
    {/* Question */}
    <FieldWithPreview label="Question" text={q.question} emphasize />

    {/* Options — each option toggles its own preview */}
    {q.options?.length > 0 && (
      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
          Options
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {q.options.map((opt, i) => (
            <FieldWithPreview
              key={i}
              label={`Option ${String.fromCharCode(65 + i)}`}
              text={opt}
            />
          ))}
        </div>
      </div>
    )}

    {/* Correct Answer — own preview */}
    <FieldWithPreview label="Correct Answer" text={q.answer} tone="success" />

    {/* Solution — own preview */}
    <FieldWithPreview label="Solution" text={q.solutionText} tone="info" />
  </div>
</div>

        ))}

        {questions.length === 0 && (
          <p className="text-center text-muted-foreground">
            No questions found
          </p>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl border-border/70 bg-card text-foreground shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {mode === "create" ? "Add Practice Question" : "Edit Practice Question"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Type plain text, or use “Insert equation” for math. Toggle each field’s preview to verify the rendering.
            </DialogDescription>
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

            <div className="space-y-2 rounded-xl border border-border/70 bg-secondary/30 p-3 sm:p-4">
              <p className="text-sm font-semibold text-foreground">Answer Options</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <QuestionMathField
                  label="Option A"
                  name="optionA"
                  value={form.optionA}
                  onChange={setField}
                  fieldRefs={fieldRefs}
                />
                <QuestionMathField
                  label="Option B"
                  name="optionB"
                  value={form.optionB}
                  onChange={setField}
                  fieldRefs={fieldRefs}
                />
                <QuestionMathField
                  label="Option C"
                  name="optionC"
                  value={form.optionC}
                  onChange={setField}
                  fieldRefs={fieldRefs}
                />
                <QuestionMathField
                  label="Option D"
                  name="optionD"
                  value={form.optionD}
                  onChange={setField}
                  fieldRefs={fieldRefs}
                />
              </div>
            </div>

            <QuestionMathField
              label="Correct Answer"
              name="answer"
              value={form.answer}
              onChange={setField}
              fieldRefs={fieldRefs}
            />
    {/* ---------------- TOPIC ---------------- */}
<div className="space-y-2">
  <label className="text-sm font-medium text-muted-foreground">
    Topic
  </label>

  {!useNewTopic ? (
    <select
      value={form.topic}
      onChange={(e) =>
        setForm((p) => ({ ...p, topic: e.target.value }))
      }
      className="
        w-full
        bg-secondary
        border border-border
        rounded-md
        px-3 py-2
        cursor-pointer
        text-foreground
        focus:outline-none
        focus:ring-2
        focus:ring-primary
      "
    >
      <option value="">Select Existing Topic</option>
      {topics.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  ) : (
    <Input
      name="topic"
      placeholder="Enter new topic name"
      value={form.topic}
      onChange={handleChange}
    />
  )}

  <Button
    type="button"
    variant="outline"
    size="sm"
    className="w-fit"
    onClick={() => {
      setUseNewTopic(!useNewTopic);
      setForm((p) => ({ ...p, topic: "" }));
    }}
  >
    {useNewTopic ? "Use Existing Topic" : "Create New Topic"}
  </Button>
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

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------- SEPARATE EQUATION-EDITOR POPUP ---------------- */}
      <KatexQuestionDialog
        open={katexOpen}
        onOpenChange={setKatexOpen}
        practiceTopicId={practiceTopicId}
        topics={topics}
        mode={katexMode}
        questionId={katexQuestionId}
        initialQuestion={katexQuestion}
        onSaved={() => {
          fetchQuestions(selectedTopic);
          fetchTopics();
        }}
      />
    </div>
  );
};

export default PracticeQuestionPage;
