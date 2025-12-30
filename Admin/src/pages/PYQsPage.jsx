import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { BASE_URL } from "@/config";

import PageHeader from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API = `${BASE_URL}/api/admin/pyq`;

const emptyForm = {
  title: "",
  exam: "",
  year: "",
  difficulty: "",
  questions: "",
  description: "",
  file: null,
};

const PYQsPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPYQs = async () => {
    const res = await fetch(API, { credentials: "include" });
    const data = await res.json();
    setPyqs(data);
  };

  useEffect(() => {
    fetchPYQs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("exam", form.exam);
    fd.append("year", String(form.year));
    fd.append("difficulty", form.difficulty);
    fd.append("questions", String(form.questions || 0));
    fd.append("description", form.description || "");

    if (form.file) fd.append("file", form.file);

    const url = mode === "create" ? API : `${API}/${currentId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      credentials: "include",
      body: fd,
    });

    if (!res.ok) {
      alert(await res.text());
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    setCurrentId(null);
    setMode("create");
    setLoading(false);
    fetchPYQs();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this PYQ?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
    fetchPYQs();
  };

  const openEdit = (item) => {
    setMode("edit");
    setCurrentId(item._id);
    setForm({
      title: item.title,
      exam: item.exam,
      year: item.year,
      difficulty: item.difficulty,
      questions: item.questions,
      description: item.description,
      file: null,
    });
    setOpen(true);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="PYQs" description="Manage Previous Year Questions">
        <Button
          className="gradient-primary"
          onClick={() => {
            setMode("create");
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add PYQ
        </Button>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Exam</th>
              <th className="p-3">Year</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Questions</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pyqs.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.exam}</td>
                <td className="p-3">{p.year}</td>
                <td className="p-3">
                  <Badge variant="secondary">{p.difficulty}</Badge>
                </td>
                <td className="p-3">{p.questions}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] flex flex-col"
          style={{
            backgroundColor: "hsl(var(--card))",
            borderColor: "hsl(var(--border))",
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add PYQ" : "Edit PYQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto grid gap-4 py-2">
            <Input name="title" placeholder="Title" value={form.title} onChange={handleChange} />

            <Select
              value={form.exam}
              onValueChange={(val) => setForm((p) => ({ ...p, exam: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NIMCET">NIMCET</SelectItem>
                <SelectItem value="VIT">VIT</SelectItem>
                <SelectItem value="CUET">CUET</SelectItem>
                <SelectItem value="MAH-CET">MAH-CET</SelectItem>
              </SelectContent>
            </Select>

            {/* ✅ DIFFICULTY OPTIONS */}
            <Select
              value={form.difficulty}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, difficulty: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} />
            <Input name="questions" type="number" placeholder="Questions" value={form.questions} onChange={handleChange} />
            <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

            <Input type="file" accept="application/pdf" name="file" onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="gradient-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PYQsPage;
