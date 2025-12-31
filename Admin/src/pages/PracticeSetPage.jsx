import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Layers } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const API = `${BASE_URL}/api/admin/practice-set`;

const emptyForm = {
  title: "",
  description: "",
};

const PracticeSetPage = () => {
  const navigate = useNavigate();

  const [sets, setSets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH ---------------- */
  const fetchPracticeSets = async () => {
    try {
      const res = await fetch(API, { credentials: "include" });
      const json = await res.json();
      setSets(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Failed to fetch practice sets", err);
      setSets([]);
    }
  };

  useEffect(() => {
    fetchPracticeSets();
  }, []);

  /* ---------------- FORM ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSubmit = async () => {
    setLoading(true);

    const url = mode === "create" ? API : `${API}/${currentId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to save practice set");
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    setMode("create");
    setCurrentId(null);
    setLoading(false);
    fetchPracticeSets();
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (item) => {
    setMode("edit");
    setCurrentId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
    });
    setOpen(true);
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this practice set?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchPracticeSets();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Practice Sets"
        description="Manage hierarchical practice sets and categories"
      >
        <Button
          className="gradient-primary"
          onClick={() => {
            setMode("create");
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Practice Set
        </Button>
      </PageHeader>

      {/* ---------------- TABLE ---------------- */}
     <div className="rounded-xl border bg-card mt-6 overflow-x-auto shadow-sm">

        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Practice Categories</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
  {sets.map((s) => (
    <tr
  key={s._id}
  className="border-t hover:bg-muted/40 transition-colors cursor-pointer"
>

      {/* TITLE */}
      <td className="p-4 font-semibold text-foreground">
        {s.title}
      </td>

      {/* DESCRIPTION */}
      <td className="p-4 text-muted-foreground max-w-sm truncate">
        {s.description || "—"}
      </td>

      {/* CATEGORY COUNT */}
      <td className="p-4 text-center">
        <Badge variant="secondary" className="px-3 py-1">
          {(s.topics || []).length} Categories
        </Badge>
      </td>

      {/* STATUS */}
      <td className="p-4 text-center">
        <Badge className="bg-emerald-600/20 text-emerald-400 border border-emerald-500">
  Active
</Badge>

      </td>

      {/* ACTIONS */}
      <td className="p-4 flex gap-2 justify-center">
  {/* EDIT */}
  <Button
    size="sm"
    className="bg-slate-800 hover:bg-slate-700 text-white shadow-sm cursor-pointer"
    onClick={() => openEdit(s)}
  >
    <Pencil className="h-4 w-4 mr-1" />
    Edit
  </Button>

  {/* SHOW PRACTICE CATEGORIES */}
  <Button
    size="sm"
    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm cursor-pointer"
    onClick={() =>
      navigate(`/admin/practice-set/${s._id}/categories`)
    }
  >
    <Layers className="h-4 w-4 mr-1" />
    Show Practice Categories
  </Button>

  {/* DELETE */}
  <Button
    size="sm"
    className="bg-red-600 hover:bg-red-500 text-white shadow-sm cursor-pointer"
    onClick={() => handleDelete(s._id)}
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</td>

    </tr>
  ))}

  {sets.length === 0 && (
    <tr>
      <td colSpan={5} className="p-6 text-center text-muted-foreground">
        No practice sets found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl bg-card">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Practice Set" : "Edit Practice Set"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Practice Set Title"
              value={form.title}
              onChange={handleChange}
            />
            <Textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
  variant="outline"
  className="cursor-pointer border-slate-600 text-slate-200 hover:bg-slate-800"
  onClick={() => setOpen(false)}
>
  Cancel
</Button>

<Button
  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
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

export default PracticeSetPage;
