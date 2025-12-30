import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/home-course`;

const emptyForm = {
  title: "",
  description: "",
  duration: "",
  mode: "",
  courseType: "",
  exams: "",
  link: "",
};

const HomeCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // ✅ NEW

  /* ---------------- FETCH COURSES ---------------- */
  const fetchCourses = async () => {
    const res = await fetch(`${API}/get-courses`, {
      credentials: "include",
    });
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
      description: course.description || "",
      duration: course.duration || "",
      mode: course.mode || "",
      courseType: course.courseType || "",
      exams: (course.exams || []).join(", "),
      link: course.link || "",
    });
    setEditingId(course._id);
    setOpen(true);
  };

  /* ---------------- ADD / UPDATE COURSE ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      ...form,
      exams: form.exams.split(",").map((e) => e.trim()),
    };

    const url = editingId
      ? `${API}/update-course/${editingId}`
      : `${API}/add-course`;

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  /* ---------------- DELETE COURSE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;

    await fetch(`${API}/delete-course/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchCourses();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Home Courses"
        description="Manage courses displayed on the homepage"
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
              <th className="p-3">Type</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Exams</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium">{c.title}</td>
                <td className="p-3">{c.courseType}</td>
                <td className="p-3">{c.mode}</td>
                <td className="p-3">{(c.exams || []).join(", ")}</td>
                <td className="p-3">
                  <Badge variant="secondary">Active</Badge>
                </td>
                <td className="p-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(c._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
        <DialogContent className="max-w-xl 
    bg-white dark:bg-zinc-900 
    text-zinc-900 dark:text-zinc-100 
    border border-zinc-200 dark:border-zinc-800 
    shadow-xl cursor-pointer">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Home Course" : "Add Home Course"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
            <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <Input name="duration" placeholder="Duration (e.g. 6 Months)" value={form.duration} onChange={handleChange} />
            <Input name="mode" placeholder="Mode (Online / Offline)" value={form.mode} onChange={handleChange} />
            <Input name="courseType" placeholder="Course Type (live / recorded)" value={form.courseType} onChange={handleChange} />
            <Input name="exams" placeholder="Exams (comma separated)" value={form.exams} onChange={handleChange} />
            <Input name="link" placeholder="Course Link" value={form.link} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button className="cursor-pointer" variant="outline" onClick={() => setOpen(false)}>
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

export default HomeCoursesPage;
