import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const PracticeQuestionPage = () => {
  const { practiceTopicId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [useNewTopic, setUseNewTopic] = useState(false);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
const renderWithMath = (text) => {
  if (!text) return "No question text";

  const parts = text.split(/(\$[^$]+\$)/g);

  return parts.map((part, i) => {
    if (part.startsWith("$") && part.endsWith("$")) {
      let math = part.slice(1, -1).trim();
      const isMatrix = /\\begin\{bmatrix\}|\\begin\{pmatrix\}|\\\\/.test(math);

      math = math
        .replace(/\\\\/g, "\\")
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
        .replace(/\{?(\d+)\s*\\choose\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Cc]\s*(\d+)\}?/g, "{$1 \\choose $2}")
        .replace(/\{?(\d+)\s*[Pp]\s*(\d+)\}?/g, "{$1 \\mathrm{P} $2}");

      return isMatrix ? (
        <BlockMath key={i} math={math} />
      ) : (
        <InlineMath key={i} math={math} />
      );
    }

    return <span key={i}>{part}</span>;
  });
};

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Practice Questions"
        description="Manage questions under this practice category"
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={() => {
            setMode("create");
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </PageHeader>
             {topics.length > 0 && (
        <div className="mb-4">
          <select
            className="bg-secondary border border-border rounded-md px-3 py-2 cursor-pointer"
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
    hover:border-indigo-300/50
  "
>
  {/* ---------- HEADER ---------- */}
  <div className="flex items-start justify-between px-5 py-4 border-b border-border">
    <div className="space-y-1">
      <Badge
        variant="secondary"
        className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
      >
        Topic: {q.topic || "General"}
      </Badge>
      <p className="text-xs text-muted-foreground">
        Question ID: {q._id.slice(-6)}
      </p>
    </div>

    <div className="flex gap-2 opacity-90 group-hover:opacity-100">
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
        className="bg-red-600 hover:bg-red-500 text-white flex items-center gap-1"
        onClick={() => handleDelete(q._id)}
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  </div>

  {/* ---------- QUESTION BODY ---------- */}
  <div className="px-5 py-4 space-y-4">
    {/* Question Text */}
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
        Question
      </h3>
      <p className="text-base leading-relaxed font-medium">
        {q.question}
      </p>
    </div>

    {/* KaTeX Preview */}
    <details className="rounded-lg bg-muted/40 p-3">
      <summary className="cursor-pointer text-sm font-medium text-indigo-600">
        View Math Preview (KaTeX)
      </summary>
      <div className="mt-3 text-sm leading-relaxed">
        {renderWithMath(q.question)}
      </div>
    </details>

    {/* Options */}
    {q.options?.length > 0 && (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Options
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {q.options.map((opt, i) => (
            <div
              key={i}
              className="
                rounded-md
                border
                px-3 py-2
                text-sm
                bg-secondary
                flex gap-2
              "
            >
              <span className="font-semibold text-muted-foreground">
                {String.fromCharCode(65 + i)}.
              </span>
              <span>{opt}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Answer */}
    {q.answer && (
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
        <p className="text-sm">
          <span className="font-semibold text-green-700 dark:text-green-300">
            Correct Answer:
          </span>{" "}
          {q.answer}
        </p>
      </div>
    )}
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
       <DialogContent
  className="
    max-w-3xl
    bg-[hsl(var(--card))]
    text-foreground
    border border-border
    shadow-card
    opacity-100
  "
>

          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
  {mode === "create"
    ? "Add Practice Question"
    : "Edit Practice Question"}
</DialogTitle>

          </DialogHeader>

          <div className="grid gap-4">
            <Textarea
  name="question"
  placeholder="Enter the full question statement here"
  value={form.question}
  onChange={handleChange}
/>


            <div className="grid grid-cols-2 gap-3">
              <div className="grid grid-cols-2 gap-3">
  <Input
    name="optionA"
    placeholder="Option A"
    value={form.optionA}
    onChange={handleChange}
  />
  <Input
    name="optionB"
    placeholder="Option B"
    value={form.optionB}
    onChange={handleChange}
  />
  <Input
    name="optionC"
    placeholder="Option C"
    value={form.optionC}
    onChange={handleChange}
  />
  <Input
    name="optionD"
    placeholder="Option D"
    value={form.optionD}
    onChange={handleChange}
  />
</div>

            </div>

            <Input
  name="answer"
  placeholder="Enter the correct answer (exact option text)"
  value={form.answer}
  onChange={handleChange}
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
        focus:ring-indigo-500
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


            <Textarea
  name="solutionText"
  placeholder="Explain the solution step by step (optional but recommended)"
  value={form.solutionText}
  onChange={handleChange}
/>

          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PracticeQuestionPage;
