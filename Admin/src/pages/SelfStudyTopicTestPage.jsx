import { useEffect, useState } from "react";
import { Plus, Trash2, ClipboardList, BarChart3 } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/selfstudy/topic/test`;

const emptyForm = {
  title: "",
  totalDurationMinutes: "",
};

const SelfStudyTopicTestPage = () => {
  const { topicId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const topic = state?.topic;
  const subject = state?.subject;
  const course = state?.course;

  const [tests, setTests] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH TESTS ================= */
  const fetchTests = async () => {
    try {
      const res = await fetch(`${API}/topic/${topicId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTests(data || []);
    } catch (err) {
      console.error("Failed to fetch tests", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [topicId]);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= CREATE TEST ================= */
  const handleCreate = async () => {
    if (!form.title) return alert("Test title required");

    setLoading(true);

    const payload = {
      title: form.title,
      topic: topicId,
      totalDurationMinutes: Number(form.totalDurationMinutes || 0),
    };

    const res = await fetch(API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to create test");
      setLoading(false);
      return;
    }

    setForm(emptyForm);
    setOpen(false);
    setLoading(false);
    fetchTests();
  };

  /* ================= DELETE TEST ================= */
  const handleDelete = async (testId) => {
    if (!confirm("Delete this test permanently?")) return;

    await fetch(`${API}/${testId}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchTests();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Tests – ${topic?.title || "Topic"}`}
        description={`${course?.title || ""} / ${subject?.title || ""}`}
      >
        <Button
          className="gradient-primary shadow-glow"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Test
        </Button>
      </PageHeader>

      {/* ================= TEST LIST ================= */}
      <div className="grid gap-5 mt-6">
        {tests.map((t) => (
          <div
            key={t._id}
            className="gradient-card shadow-card rounded-xl p-6 flex flex-col xl:flex-row gap-6 border"
          >
            {/* INFO */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{t.title}</h3>

              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">
                  ⏱ {t.totalDurationMinutes || 0} min
                </Badge>
                <Badge variant="outline">
                  ❓ {t.totalQuestions || 0} Questions
                </Badge>
                <Badge variant="outline">
                  🧮 {t.totalMarks || 0} Marks
                </Badge>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 min-w-[220px]">
              <button
                onClick={() =>
                  navigate(
                    `/admin/self-study/tests/${t._id}/questions`,
                    { state: { test: t, topic, subject, course } }
                  )
                }
                className="gradient-primary text-black rounded-lg py-2.5 font-semibold shadow-glow hover:opacity-90 transition"
              >
                <ClipboardList size={16} className="inline mr-2" />
                Manage Questions
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/admin/self-study/tests/${t._id}/analytics`,
                    { state: { test: t } }
                  )
                }
                className="bg-secondary rounded-lg py-2 font-medium hover:bg-accent transition"
              >
                <BarChart3 size={16} className="inline mr-2" />
                View Analytics
              </button>

              <button
                onClick={() => handleDelete(t._id)}
                className="bg-destructive text-white rounded-lg py-2 font-medium shadow hover:opacity-90 transition"
              >
                <Trash2 size={16} className="inline mr-2" />
                Delete Test
              </button>
            </div>
          </div>
        ))}

        {tests.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-xl">
            No tests created yet
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md gradient-card shadow-card border">
          <DialogHeader>
            <DialogTitle>Create New Test</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Test Title"
              value={form.title}
              onChange={handleChange}
            />

            <Input
              name="totalDurationMinutes"
              placeholder="Duration (minutes)"
              type="number"
              value={form.totalDurationMinutes}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[hsl(var(--success))]"
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Test"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfStudyTopicTestPage;
