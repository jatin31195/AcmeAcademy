import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
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

const API = `${BASE_URL}/api/admin/selfstudy/subjects`;

const emptyForm = {
  title: "",
  emoji: "",
};

const SelfStudySubjectPage = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;

  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH SUBJECTS ---------------- */
  const fetchSubjects = async () => {
    const res = await fetch(`${API}/course/${courseId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setSubjects(data);
  };

  useEffect(() => {
    fetchSubjects();
  }, [courseId]);

  /* ---------------- FORM CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- OPEN ADD ---------------- */
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  /* ---------------- OPEN EDIT ---------------- */
  const openEdit = (subject) => {
    setForm({
      title: subject.title,
      emoji: subject.emoji || "",
    });
    setEditingId(subject._id);
    setOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      ...form,
      courseId,
    };

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save subject");
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchSubjects();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this subject?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchSubjects();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Subjects – ${course?.title || "Course"}`}
        description="Manage subjects and their topics"
      >
        <Button
          className="gradient-primary cursor-pointer"
          onClick={openAdd}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </PageHeader>

      {/* ---------------- SUBJECT LIST ---------------- */}
      <div className="grid gap-4 mt-6">
        {subjects.map((s) => (
          <div
            key={s._id}
            className="
              rounded-xl border bg-card
              p-5
              flex flex-col md:flex-row
              md:items-center md:justify-between
              gap-4
              shadow-sm
              hover:shadow-md
              transition
            "
          >
            {/* LEFT INFO */}
            <div className="flex items-center gap-4">
              <div className="text-3xl">{s.emoji}</div>
              <div>
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <Badge variant="secondary" className="mt-1">
                  Active
                </Badge>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="w-full md:w-auto">
              <div className="rounded-lg border bg-muted/30 p-3 min-w-[220px]">
                {/* SHOW TOPICS */}
                <button
                  onClick={() =>
                    navigate(
                      `/admin/self-study-courses/${courseId}/subjects/${s._id}/topics`,
                      { state: { subject: s, course } }
                    )
                  }
                  className="
                    w-full mb-3
                    flex items-center justify-center gap-2
                    rounded-md
                    bg-indigo-600 text-white
                    py-2.5
                    text-sm font-semibold
                    shadow
                    hover:bg-indigo-700
                    active:scale-95
                    transition
                    cursor-pointer
                  "
                >
                  📘 Show Topics
                </button>

                {/* EDIT / DELETE */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-md
                      bg-amber-500 text-white
                      py-2
                      text-sm font-medium
                      shadow
                      hover:bg-amber-600
                      active:scale-95
                      transition
                      cursor-pointer
                    "
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
                    className="
                      flex items-center justify-center gap-2
                      rounded-md
                      bg-red-600 text-white
                      py-2
                      text-sm font-medium
                      shadow
                      hover:bg-red-700
                      active:scale-95
                      transition
                      cursor-pointer
                    "
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="p-8 text-center text-muted-foreground border rounded-xl">
            No subjects found
          </div>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-900 border shadow-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Subject" : "Add Subject"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Subject Title"
              value={form.title}
              onChange={handleChange}
            />
            <Input
              name="emoji"
              placeholder="Emoji (📘 📐 🧠)"
              value={form.emoji}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-800 cursor-pointer"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelfStudySubjectPage;
