import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/yearly-result`;

const YearlyResultPage = () => {
  const { exam } = useParams();

  const [exams, setExams] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedExam, setSelectedExam] = useState(exam || "");
  const [selectedYear, setSelectedYear] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- ADD / EDIT STATE ---------- */
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    exam: "",
    year: "",
    rank: "",
    score: "",
    photo: null,
  });

  /* ================= FETCH EXAMS ================= */
  useEffect(() => {
    fetch(`${API}/exams`)
      .then((res) => res.json())
      .then(setExams);
  }, []);

  /* ================= FETCH YEARS ================= */
  useEffect(() => {
    if (!selectedExam) return;
    fetch(`${API}/years/${selectedExam.toLowerCase()}`)
      .then((res) => res.json())
      .then(setYears);
  }, [selectedExam]);

  /* ================= FETCH RESULTS ================= */
  const fetchResults = async () => {
    if (!selectedExam || !selectedYear) return;

    setLoading(true);
    const res = await fetch(
      `${API}/${selectedExam.toLowerCase()}/${selectedYear}`
    );
    const data = await res.json();
    setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, [selectedExam, selectedYear]);

  /* ================= ADD ================= */
  const handleAdd = async () => {
  const fd = new FormData();

  Object.entries(form).forEach(([k, v]) => {
    if (v !== null && v !== "") fd.append(k, v);
  });

  // ✅ force empty photoType
  fd.append("photoType", "");

  await fetch(`${API}/add-result`, {
    method: "POST",
    credentials: "include",
    body: fd,
  });

  setOpenAdd(false);
  setForm({
    name: "",
    exam: "",
    year: "",
    rank: "",
    score: "",
    photo: null,
  });

  fetchResults();
};


  /* ================= UPDATE ================= */
const handleUpdate = async () => {
  if (!editing) return;

  const fd = new FormData();

  Object.entries(form).forEach(([k, v]) => {
    if (v !== null && v !== "") fd.append(k, v);
  });

  // ✅ force empty photoType
  fd.append("photoType", "");

  await fetch(`${API}/update-result/${editing._id}`, {
    method: "PUT",
    credentials: "include",
    body: fd,
  });

  setOpenEdit(false);
  setEditing(null);
  fetchResults();
};


  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!confirm("Delete this result?")) return;
    await fetch(`${API}/delete-result/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchResults();
  };

  /* ================= OPEN EDIT ================= */
  const openEditModal = (r) => {
    setEditing(r);
    setForm({
      name: r.name || "",
      exam: r.exam || "",
      year: r.year || "",
      rank: r.rank || "",
      score: r.score || "",
      photo: null,
    });
    setOpenEdit(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Yearly Results"
        description="Add, edit & manage year-wise results"
      >
        <Button className="gradient-primary" onClick={() => setOpenAdd(true)}>
          ➕ Add Result
        </Button>
      </PageHeader>

      {/* ================= FILTERS ================= */}
      <div className="rounded-xl border bg-card p-6 flex gap-4 flex-wrap">
        <select
  className="
    bg-white
    text-slate-900
    border border-slate-300
    rounded-lg
    px-4 py-2
    min-w-[200px]
    focus:outline-none
    focus:ring-2
    focus:ring-primary
    focus:border-primary
  "
  value={selectedExam}
  onChange={(e) => {
    setSelectedExam(e.target.value);
    setSelectedYear("");
    setResults([]);
  }}
>
  <option value="" className="text-slate-500">
    Select Exam
  </option>
  {exams.map((e) => (
    <option key={e} value={e} className="text-slate-900">
      {e}
    </option>
  ))}
</select>


        <select
  className="
    bg-white
    text-slate-900
    border border-slate-300
    rounded-lg
    px-4 py-2
    min-w-[160px]
    focus:outline-none
    focus:ring-2
    focus:ring-primary
    focus:border-primary
    disabled:opacity-60
  "
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  disabled={!years.length}
>
  <option value="" className="text-slate-500">
    Select Year
  </option>
  {years.map((y) => (
    <option key={y} value={y} className="text-slate-900">
      {y}
    </option>
  ))}
</select>

      </div>

      {/* ================= RESULTS ================= */}
      <div className="grid gap-6">
        {results.map((r) => (
          <div
            key={r._id}
            className="rounded-2xl border bg-card shadow-lg p-6 flex flex-col lg:flex-row gap-6"
          >
            {/* BIG PHOTO */}
            <div className="w-full lg:w-60 h-72 rounded-xl overflow-hidden bg-secondary">
              <img
                src={r.photoUrl}
                alt={r.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* INFO */}
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-semibold">{r.name}</h3>

              <div className="flex flex-wrap gap-2">
                {r.rank && (
                  <Badge className="bg-green-600 text-white">
                    AIR {r.rank}
                  </Badge>
                )}
                {r.score && <Badge variant="outline">Score {r.score}</Badge>}
                <Badge variant="secondary">{r.exam?.toUpperCase()}</Badge>
                <Badge variant="secondary">{r.year}</Badge>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => openEditModal(r)}>
                  ✏️ Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(r._id)}
                >
                  🗑 Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Dialog open={openAdd || openEdit} onOpenChange={() => {
        setOpenAdd(false);
        setOpenEdit(false);
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {openEdit ? "Edit Result" : "Add Result"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <Input placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Exam" value={form.exam}
              onChange={(e) => setForm({ ...form, exam: e.target.value })} />
            <Input type="number" placeholder="Year" value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })} />
            <Input type="number" placeholder="Rank" value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })} />
            <Input placeholder="Score" value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })} />
            <Input type="file" accept="image/*"
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })} />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => {
              setOpenAdd(false);
              setOpenEdit(false);
            }}>
              Cancel
            </Button>
            <Button onClick={openEdit ? handleUpdate : handleAdd}>
              {openEdit ? "Update" : "Add"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YearlyResultPage;
