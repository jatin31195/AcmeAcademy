import { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Search,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  Download,
  Save,
  Trash2,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/config";

// All access goes through the admin-only backend (cookie-authenticated).
// The browser never talks to Firestore directly.
const API = `${BASE_URL}/api/admin/rank-predictor`;

// Columns shown in the table + CSV (order matters).
// `rank` is a derived value — display-only, never edited or saved.
const FIELDS = [
  { key: "name", label: "Name", editable: true },
  { key: "phone", label: "Phone", editable: true },
  { key: "marks", label: "Marks", editable: true },
  { key: "category", label: "Category", editable: true },
  { key: "regNo", label: "RegNo", editable: true },
  { key: "city", label: "City", editable: true },
  { key: "state", label: "State", editable: true },
  { key: "rank", label: "Rank", editable: false },
];

const csvCell = (value) => {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const RankPredictorUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const [marksFilter, setMarksFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState("none"); // none | asc | desc

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load data");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Rank predictor fetch error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Local edits update the in-memory row; Save pushes it to Firestore.
  const updateField = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const filtered = useMemo(() => {
    const minMarks = Number(marksFilter);
    const term = search.trim().toLowerCase();

    const list = users.filter((u) => {
      const matchesMarks = !minMarks || Number(u.marks) >= minMarks;
      const matchesSearch =
        !term || Object.values(u).join(" ").toLowerCase().includes(term);
      return matchesMarks && matchesSearch;
    });

    if (sortDir === "asc") {
      return [...list].sort((a, b) => Number(a.marks) - Number(b.marks));
    }
    if (sortDir === "desc") {
      return [...list].sort((a, b) => Number(b.marks) - Number(a.marks));
    }
    return list;
  }, [users, marksFilter, search, sortDir]);

  const saveEdit = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    try {
      setSavingId(id);
      const payload = Object.fromEntries(
        FIELDS.filter((f) => f.editable).map((f) => [
          f.key,
          String(user[f.key] ?? "").trim(),
        ])
      );
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setSavingId(null);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this entry permanently?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  const downloadCSV = () => {
    if (!filtered.length) {
      alert("No data available to download.");
      return;
    }
    const headers = FIELDS.map((f) => f.label);
    const lines = filtered.map((u) =>
      FIELDS.map((f) => csvCell(u[f.key])).join(",")
    );
    const csv = [headers.map(csvCell).join(","), ...lines].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nimcet_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="NIMCET Rank Predictor Users"
        description="Rank-predictor submissions from Firestore — search, edit inline, and export."
      >
        <Button variant="outline" className="border-border" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button
          className="gradient-primary text-primary-foreground"
          onClick={downloadCSV}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <Input
          type="number"
          placeholder="Marks above..."
          className="h-10 w-full bg-secondary border-border lg:max-w-[180px]"
          value={marksFilter}
          onChange={(e) => setMarksFilter(e.target.value)}
        />
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, city, phone, etc..."
            className="h-10 pl-10 bg-secondary border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={sortDir === "asc" ? "default" : "outline"}
            className="h-10 border-border"
            onClick={() => setSortDir((p) => (p === "asc" ? "none" : "asc"))}
          >
            <ArrowUpWideNarrow className="h-4 w-4 mr-2" />
            Marks ↑
          </Button>
          <Button
            variant={sortDir === "desc" ? "default" : "outline"}
            className="h-10 border-border"
            onClick={() => setSortDir((p) => (p === "desc" ? "none" : "desc"))}
          >
            <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
            Marks ↓
          </Button>
        </div>
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Showing {filtered.length} of {users.length} submissions
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Editable table */}
      <div
        className="rounded-xl border shadow-card"
        style={{
          backgroundColor: "hsl(var(--card))",
          borderColor: "hsl(var(--border))",
        }}
      >
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse">
            <thead>
              <tr style={{ borderColor: "hsl(var(--border))" }}>
                <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-muted-foreground">#</th>
                {FIELDS.map((f) => (
                  <th
                    key={f.key}
                    className="whitespace-nowrap p-3 text-left text-sm font-medium text-muted-foreground"
                  >
                    {f.label}
                  </th>
                ))}
                <th className="whitespace-nowrap p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, index) => (
                <tr key={u.id} className="border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="p-2 text-sm text-muted-foreground">{index + 1}</td>
                  {FIELDS.map((f) =>
                    f.editable ? (
                      <td key={f.key} className="p-2">
                        <Input
                          value={u[f.key] ?? ""}
                          onChange={(e) => updateField(u.id, f.key, e.target.value)}
                          className="h-9 min-w-[110px] bg-secondary border-border"
                        />
                      </td>
                    ) : (
                      <td key={f.key} className="p-2">
                        <span className="block min-w-[70px] px-1 text-sm font-medium text-foreground">
                          {u[f.key] ?? "-"}
                        </span>
                      </td>
                    )
                  )}
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="gradient-primary h-8 px-2 text-xs text-primary-foreground"
                        disabled={savingId === u.id}
                        onClick={() => saveEdit(u.id)}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {savingId === u.id ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-rose-500/40 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                        onClick={() => deleteEntry(u.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <p className="mt-4 text-muted-foreground">Loading submissions...</p>}
      {!loading && !filtered.length && !error && (
        <p className="mt-4 text-muted-foreground">No submissions found.</p>
      )}
    </div>
  );
};

export default RankPredictorUsersPage;
