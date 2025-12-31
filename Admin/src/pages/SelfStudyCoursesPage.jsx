import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/selfstudy`;

const emptyForm = {
  title: "",
  category: "",
  exam: "",
  type: "",
  description: "",
};

const SelfStudyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

  /* ---------------- FETCH COURSES ---------------- */
  const fetchCourses = async () => {
    const res = await fetch(API, { credentials: "include" });
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
  const openEdit = (course) => {
    setForm({
      title: course.title || "",
      category: course.category || "",
      exam: course.exam || "",
      type: course.type || "",
      description: course.description || "",
    });
    setEditingId(course._id);
    setOpen(true);
  };

  /* ---------------- ADD / UPDATE ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to save course");
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchCourses();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchCourses();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Self Study Courses"
        description="Manage self study courses and subjects"
      >
        <Button className="gradient-primary" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </PageHeader>

      {/* ---------------- TABLE ---------------- */}
      <div className="rounded-xl border bg-card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Exam</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">{c.exam}</td>
                <td className="p-3">{c.type}</td>
                <td className="p-3">
                  <Badge variant="secondary">Active</Badge>
                </td>
                <td className="p-3">
  <div className="w-full max-w-[260px] mx-auto rounded-xl border bg-muted/30 p-4 shadow-sm">
    
    {/* SHOW SUBJECTS */}
    <button
      onClick={() =>
        navigate(`/admin/self-study-courses/${c._id}/subjects`, {
          state: { course: c },
        })
      }
      className="
        w-full mb-3
        flex items-center justify-center gap-2
        rounded-lg
        bg-indigo-600 text-white
        py-2.5
        text-sm font-semibold
        shadow-md
        hover:bg-indigo-700
        hover:shadow-lg
        active:scale-95
        transition
        cursor-pointer
      "
    >
      📚 Show Subjects
    </button>

    {/* EDIT + DELETE */}
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => openEdit(c)}
        className="
          flex items-center justify-center gap-2
          rounded-lg
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
        onClick={() => handleDelete(c._id)}
        className="
          flex items-center justify-center gap-2
          rounded-lg
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
</td>

              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-zinc-900 border shadow-xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Self Study Course" : "Add Self Study Course"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Course Title"
              value={form.title}
              onChange={handleChange}
            />
            <Input
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
            />
            <Input
              name="exam"
              placeholder="Exam (UPSC / SSC / Banking)"
              value={form.exam}
              onChange={handleChange}
            />
            <Input
              name="type"
              placeholder="Type (Recorded / Self Study)"
              value={form.type}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-800"
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

export default SelfStudyCoursesPage;
