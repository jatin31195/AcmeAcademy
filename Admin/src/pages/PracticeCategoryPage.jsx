import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, ListChecks } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
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

const API = `${BASE_URL}/api/admin/practice-set/t`;

const emptyForm = {
  title: "",
  description: "",
};

const PracticeCategoryPage = () => {
  const { practiceSetId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("create");
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH ---------------- */
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/${practiceSetId}`, {
        credentials: "include",
      });
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [practiceSetId]);

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

    const payload =
      mode === "create"
        ? { ...form, practiceSetId }
        : form;

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save category");
      setLoading(false);
      return;
    }

    setOpen(false);
    setForm(emptyForm);
    setMode("create");
    setCurrentId(null);
    setLoading(false);
    fetchCategories();
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
    if (!confirm("Delete this category?")) return;

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchCategories();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Practice Categories"
        description="Manage categories under this practice set"
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-sm"
          onClick={() => {
            setMode("create");
            setForm(emptyForm);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </PageHeader>

      {/* ---------------- TABLE ---------------- */}
      <div className="rounded-xl border bg-card mt-6 overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Questions</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr
                key={c._id}
                className="border-t hover:bg-muted/40 transition-colors cursor-pointer"
              >
                {/* TITLE */}
                <td className="p-4 font-semibold text-foreground">
                  {c.title}
                </td>

                {/* DESCRIPTION */}
                <td className="p-4 text-muted-foreground max-w-sm truncate">
                  {c.description || "—"}
                </td>

                {/* QUESTIONS COUNT */}
                <td className="p-4 text-center">
                  <Badge className="bg-slate-700/50 text-slate-200 border border-slate-600">
                    {(c.Questions || []).length}
                  </Badge>
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex gap-2 justify-center">
                  {/* EDIT */}
                  <Button
                    size="sm"
                    className="bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  {/* SHOW QUESTIONS */}
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/practice-category/${c._id}/questions`)
                    }
                  >
                    <ListChecks className="h-4 w-4 mr-1" />
                    Show Questions
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                    onClick={() => handleDelete(c._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No categories found
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
              {mode === "create"
                ? "Add Practice Category"
                : "Edit Practice Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              name="title"
              placeholder="Category Title"
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

export default PracticeCategoryPage;
