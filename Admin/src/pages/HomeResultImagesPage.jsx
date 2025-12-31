import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/home-image`;

const HomeResultImagesPage = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [exam, setExam] = useState("");
  const [photo, setPhoto] = useState(null);

  /* ---------------- FETCH HOME IMAGES ---------------- */
  const fetchImages = async () => {
    try {
      const res = await fetch(API, { credentials: "include" });
      const json = await res.json();
      setImages(Array.isArray(json) ? json : []);
    } catch {
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  /* ---------------- ADD IMAGE ---------------- */
  const handleSubmit = async () => {
    if (!exam || !photo) {
      alert("Exam and image are required");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("exam", exam);
    data.append("photo", photo);

    const res = await fetch(`${API}/add`, {
      method: "POST",
      credentials: "include",
      body: data,
    });

    if (!res.ok) {
      alert("Failed to upload image");
      setLoading(false);
      return;
    }

    setExam("");
    setPhoto(null);
    setOpen(false);
    setLoading(false);
    fetchImages();
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!confirm("Delete this home image?")) return;

    await fetch(`${API}/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchImages();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Home Result Images"
        description="Images shown on the home page"
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Home Image
        </Button>
      </PageHeader>

      {/* ---------------- IMAGE LIST ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {images.map((img) => (
          <div
            key={img._id}
            className="rounded-xl border bg-card shadow-card overflow-hidden"
          >
            <img
              src={img.photoUrl}
              alt={img.exam}
              className="h-48 w-full object-cover"
            />

            <div className="p-4 space-y-2">
              <p className="font-semibold text-foreground">
                {img.exam?.toUpperCase()}
              </p>

              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-500 text-white w-full"
                onClick={() => handleDelete(img._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <p className="text-center col-span-full text-muted-foreground">
            No home images added yet
          </p>
        )}
      </div>

      {/* ---------------- MODAL ---------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md 
    bg-[hsl(var(--card))]
    text-foreground
    border border-border
    shadow-card
    opacity-100">
          <DialogHeader>
            <DialogTitle>Add Home Result Image</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Input
              placeholder="Exam (e.g. NIMCET, JEE, NEET)"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
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
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomeResultImagesPage;
