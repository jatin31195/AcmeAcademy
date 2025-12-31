import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/selfstudy/topic/test`;

const emptyQuestion = {
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
};

const SelfStudyTestQuestionPage = () => {
  const { testId } = useParams();
  const { state } = useLocation();
  const test = state?.test;

  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyQuestion);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH TEST ================= */
  const fetchTest = async () => {
    const res = await fetch(`${API}/${testId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setQuestions(data.questions || []);
  };

  useEffect(() => {
    fetchTest();
  }, [testId]);

  /* ================= FORM HANDLERS ================= */
  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((p) => ({ ...p, options: updated }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyQuestion);
    setOpen(true);
  };

  const openEdit = (q) => {
    setEditingId(q._id);
    setForm({
      text: q.text,
      options: q.options || ["", "", "", ""],
      correctAnswer: q.correctAnswer,
    });
    setOpen(true);
  };

  /* ================= SAVE (ADD / EDIT) ================= */
  const handleSave = async () => {
    if (!form.text || !form.correctAnswer) {
      return alert("Question text & correct answer required");
    }

    setLoading(true);

    try {
      if (editingId) {
        // UPDATE QUESTION
        await fetch(`${API}/${testId}/questions/${editingId}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // ADD QUESTION
        await fetch(`${API}/${testId}/add-questions`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions: [form],
          }),
        });
      }

      setOpen(false);
      setForm(emptyQuestion);
      setEditingId(null);
      fetchTest();
    } catch (err) {
      alert("Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE QUESTION ================= */
  const handleDelete = async (qid) => {
    if (!confirm("Delete this question?")) return;

    await fetch(`${API}/${testId}/questions/${qid}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchTest();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Questions – ${test?.title || "Test"}`}
        description="Add, edit & manage test questions"
      >
        <Button className="gradient-primary shadow-glow" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </PageHeader>

      {/* ================= QUESTION LIST ================= */}
      <div className="grid gap-5 mt-6">
        {questions.map((q, idx) => (
          <div
            key={q._id}
            className="gradient-card shadow-card rounded-xl p-6 border"
          >
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">
                  Q{idx + 1}. {q.text}
                </h3>

                <ul className="mt-3 grid gap-2">
                  {q.options?.map((opt, i) => (
                    <li
                      key={i}
                      className={`px-3 py-2 rounded-md border ${
                        opt === q.correctAnswer
                          ? "bg-[hsl(var(--success))] text-white"
                          : "bg-secondary"
                      }`}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>

                <Badge className="mt-3" variant="outline">
                  Correct: {q.correctAnswer}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEdit(q)}
                  className="bg-[hsl(var(--warning))] text-black rounded-md px-3 py-2"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(q._id)}
                  className="bg-destructive text-white rounded-md px-3 py-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-xl">
            No questions added yet
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl gradient-card shadow-card border">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Question" : "Add Question"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Textarea
              placeholder="Question text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />

            {form.options.map((opt, i) => (
              <Input
                key={i}
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
              />
            ))}

            <Input
              placeholder="Correct Answer (exact text)"
              value={form.correctAnswer}
              onChange={(e) =>
                setForm({ ...form, correctAnswer: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[hsl(var(--success))]"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Question"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfStudyTestQuestionPage;
