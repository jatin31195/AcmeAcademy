import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
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

const API = `${BASE_URL}/api/admin/home-notice`;

const emptyForm = {
  title: "",
  tag: "",
  link: "",
};

const HomeNoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("create"); // create | edit
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  /* ---------------- FETCH ---------------- */
  const fetchNotices = async () => {
    const res = await fetch(API, { credentials: "include" });
    const json = await res.json();
    setNotices(Array.isArray(json) ? json : []);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  /* ---------------- CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- EDIT ---------------- */
  const openEdit = (n) => {
    setMode("edit");
    setCurrentId(n._id);
    setForm({
      title: n.title || "",
      tag: n.tag || "",
      link: n.link || "",
    });
    setOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    if (!form.title) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    const url =
      mode === "create"
        ? `${API}/add`
        : `${API}/edit/${currentId}`;

    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to save notice");
      setLoading(false);
      return;
    }

    setForm(emptyForm);
    setMode("create");
    setCurrentId(null);
    setOpen(false);
    setLoading(false);
    fetchNotices();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this notice?")) return;

    await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchNotices();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Home Notices"
        description="Manage notices shown on the home page"
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
          Add Notice
        </Button>
      </PageHeader>

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-4 mt-6">
        {notices.map((n) => (
          <div
            key={n._id}
            className="rounded-xl border bg-card p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">{n.title}</p>

              <div className="flex gap-2 mt-2">
                {n.tag && (
                  <Badge className="bg-slate-700 text-slate-200">
                    {n.tag}
                  </Badge>
                )}
                {!n.isActive && (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>

              {n.link && (
                <p className="text-sm text-muted-foreground mt-1">
                  {n.link}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(n)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>

              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white"
                onClick={() => handleDelete(n._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {notices.length === 0 && (
          <p className="text-center text-muted-foreground">
            No notices found
          </p>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border shadow-xl">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Add Notice" : "Edit Notice"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              name="title"
              placeholder="Notice title"
              value={form.title}
              onChange={handleChange}
            />
            <Input
              name="tag"
              placeholder="Tag (NEW, IMPORTANT, UPDATE)"
              value={form.tag}
              onChange={handleChange}
            />
            <Input
              name="link"
              placeholder="Optional link"
              value={form.link}
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

export default HomeNoticePage;
