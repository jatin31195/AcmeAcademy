import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Lock,
  Unlock,
  ExternalLink,
} from "lucide-react";
import { useParams, useLocation ,useNavigate} from "react-router-dom";
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

const API = `${BASE_URL}/api/admin/selfstudy/topic`;

const emptyForm = {
  title: "",
  locked: { assignment: false, test: false },
  links: { notes: "", lecture: "", assignment: "" },
};

const SelfStudySubjectTopicPage = () => {
  const { courseId, subjectId } = useParams();
const { state } = useLocation();
const subject = state?.subject;
const course = state?.course;
     const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    const res = await fetch(`${API}/subject/${subjectId}`, {
      credentials: "include",
    });
    setTopics(await res.json());
  };

  useEffect(() => {
    fetchTopics();
  }, [subjectId]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name.startsWith("locked.")) {
      const k = name.split(".")[1];
      return setForm((p) => ({
        ...p,
        locked: { ...p.locked, [k]: checked },
      }));
    }

    if (name.startsWith("links.")) {
      const k = name.split(".")[1];
      return setForm((p) => ({
        ...p,
        links: { ...p.links, [k]: value },
      }));
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const openEdit = (t) => {
    setForm({
      title: t.title,
      locked: t.locked,
      links: t.links,
    });
    setEditingId(t._id);
    setOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = { subjectId, ...form };
    const url = editingId ? `${API}/${editingId}` : API;

    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchTopics();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this topic?")) return;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchTopics();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Topics – ${subject?.title}`}
        description={`Course: ${course?.title}`}
      >
        <Button className="gradient-primary shadow-glow" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Topic
        </Button>
      </PageHeader>

      {/* TOPICS */}
      <div className="grid gap-5 mt-6">
  {topics.map((t) => (
    <div
      key={t._id}
      className="
        gradient-card
        shadow-card
        rounded-xl
        p-6
        flex flex-col xl:flex-row
        gap-6
        border
      "
    >
      {/* ================= LEFT : TITLE + STATUS ================= */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold tracking-tight">
          {t.title}
        </h3>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge
            className={`flex items-center gap-1 px-3 py-1 ${
              t.locked.assignment
                ? "bg-destructive text-white"
                : "bg-[hsl(var(--success))] text-white"
            }`}
          >
            {t.locked.assignment ? (
              <Lock size={14} />
            ) : (
              <Unlock size={14} />
            )}
            Assignment
          </Badge>

          <Badge
            className={`flex items-center gap-1 px-3 py-1 ${
              t.locked.test
                ? "bg-destructive text-white"
                : "bg-[hsl(var(--success))] text-white"
            }`}
          >
            {t.locked.test ? (
              <Lock size={14} />
            ) : (
              <Unlock size={14} />
            )}
            Test
          </Badge>
        </div>
      </div>

      {/* ================= CENTER : LINKS ================= */}
      <div className="flex flex-col gap-2 min-w-[220px]">
        {t.links?.lecture && (
          <a
            href={t.links.lecture}
            target="_blank"
            rel="noreferrer"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-secondary
              hover:bg-accent
              transition
              cursor-pointer
            "
          >
            <ExternalLink size={16} />
            Lecture
          </a>
        )}

        {t.links?.notes && (
          <a
            href={t.links.notes}
            target="_blank"
            rel="noreferrer"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-secondary
              hover:bg-accent
              transition
              cursor-pointer
            "
          >
            <ExternalLink size={16} />
            Notes
          </a>
        )}

        {t.links?.assignment && (
          <a
            href={t.links.assignment}
            target="_blank"
            rel="noreferrer"
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-secondary
              hover:bg-accent
              transition
              cursor-pointer
            "
          >
            <ExternalLink size={16} />
            Assignment
          </a>
        )}
      </div>

      {/* ================= RIGHT : ACTIONS ================= */}
      <div className="flex flex-col gap-3 min-w-[180px]">
        {/* PRIMARY ACTION */}
        <button
          onClick={() =>
            navigate(
  `/admin/self-study-courses/${courseId}/subjects/${subjectId}/topics/${t._id}/tests`,
  {
    state: {
      topic: t,
      subject,
      course,
    },
  }
)

          }
          className="
            gradient-primary
            text-black
            rounded-lg
            py-2.5
            font-semibold
            shadow-glow
            hover:opacity-90
            active:scale-95
            transition
            cursor-pointer
          "
        >
          🧪 Manage Tests
        </button>

        {/* EDIT */}
        <button
          onClick={() => openEdit(t)}
          className="
            bg-[hsl(var(--warning))]
            text-black
            rounded-lg
            py-2
            font-medium
            shadow
            hover:opacity-90
            active:scale-95
            transition
            cursor-pointer
          "
        >
          ✏️ Edit Topic
        </button>

        {/* DELETE */}
        <button
          onClick={() => handleDelete(t._id)}
          className="
            bg-destructive
            text-white
            rounded-lg
            py-2
            font-medium
            shadow
            hover:opacity-90
            active:scale-95
            transition
            cursor-pointer
          "
        >
          🗑 Delete Topic
        </button>
      </div>
    </div>
  ))}
</div>


      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gradient-card shadow-card">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Topic" : "Add Topic"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Topic Title"
              value={form.title}
              onChange={handleChange}
            />

            <Input name="links.lecture" placeholder="Lecture link" value={form.links.lecture} onChange={handleChange} />
            <Input name="links.notes" placeholder="Notes link" value={form.links.notes} onChange={handleChange} />
            <Input name="links.assignment" placeholder="Assignment link" value={form.links.assignment} onChange={handleChange} />

            <div className="flex gap-6">
              <label className="flex gap-2 items-center">
                <input type="checkbox" name="locked.assignment" checked={form.locked.assignment} onChange={handleChange} />
                Lock Assignment
              </label>
              <label className="flex gap-2 items-center">
                <input type="checkbox" name="locked.test" checked={form.locked.test} onChange={handleChange} />
                Lock Test
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save Topic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfStudySubjectTopicPage;
