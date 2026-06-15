import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Trash2,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  MessageSquare,
  Inbox,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/enquiries`;

// Query types submitted by the counselling / contact-us form.
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "counselling", label: "Counselling" },
  { value: "course", label: "Course" },
  { value: "admission", label: "Admission" },
  { value: "feedback", label: "Feedback" },
  { value: "suggestion", label: "Suggestion" },
  { value: "other", label: "Other" },
];

const categoryBadgeClass = {
  counselling: "bg-emerald-500/15 border-emerald-400 text-emerald-300",
  course: "bg-cyan-500/15 border-cyan-400 text-cyan-300",
  admission: "bg-violet-500/15 border-violet-400 text-violet-300",
  feedback: "bg-amber-500/15 border-amber-400 text-amber-300",
  suggestion: "bg-blue-500/15 border-blue-400 text-blue-300",
  other: "bg-slate-500/15 border-slate-400 text-slate-300",
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Wrap a value so commas / quotes / newlines don't break the CSV layout.
const csvCell = (value) => {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
};

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest"); // latest | oldest

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch(API, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch enquiries");
      const data = await res.json();
      setEnquiries((data.enquiries || []).map((e) => ({ ...e, id: e._id })));
    } catch (err) {
      console.error("Enquiries fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const filtered = useMemo(() => {
    const name = nameSearch.trim().toLowerCase();
    const keyword = messageSearch.trim().toLowerCase();

    const list = enquiries.filter((e) => {
      const matchesName = !name || (e.name || "").toLowerCase().includes(name);
      const matchesKeyword =
        !keyword || (e.message || "").toLowerCase().includes(keyword);
      const matchesCategory =
        category === "all" || (e.subject || "").toLowerCase() === category;
      return matchesName && matchesKeyword && matchesCategory;
    });

    return [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "latest" ? db - da : da - db;
    });
  }, [enquiries, nameSearch, messageSearch, category, sortOrder]);

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete enquiry");
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message || "Unable to delete enquiry");
    }
  };

  const exportCsv = (rows, fileName) => {
    if (!rows.length) {
      alert("No data to export.");
      return;
    }
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Center",
      "Category",
      "Message",
      "Submitted At",
    ];
    const lines = rows.map((e) =>
      [
        e.name,
        e.email,
        e.phone,
        e.center,
        e.subject,
        e.message,
        formatDateTime(e.createdAt),
      ]
        .map(csvCell)
        .join(",")
    );
    const csv = [headers.map(csvCell).join(","), ...lines].join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Counselling & Contact Enquiries"
        description="Every counselling / contact-us submission, saved automatically alongside the notification email."
      >
        <Button
          variant="outline"
          className="border-border"
          onClick={() => exportCsv(filtered, "enquiries-filtered.csv")}
        >
          <Download className="h-4 w-4 mr-2" />
          Export View
        </Button>
        <Button
          className="gradient-primary text-primary-foreground"
          onClick={() => exportCsv(enquiries, "enquiries-all.csv")}
        >
          <Download className="h-4 w-4 mr-2" />
          Export All CSV
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            className="h-10 pl-10 bg-secondary border-border"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full lg:max-w-xs">
          <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by message keyword..."
            className="h-10 pl-10 bg-secondary border-border"
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="h-10 border-border"
          onClick={() =>
            setSortOrder((prev) => (prev === "latest" ? "oldest" : "latest"))
          }
        >
          {sortOrder === "latest" ? (
            <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
          ) : (
            <ArrowUpWideNarrow className="h-4 w-4 mr-2" />
          )}
          {sortOrder === "latest" ? "Latest first" : "Oldest first"}
        </Button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 inline-flex items-center text-xs text-muted-foreground">
          <Filter className="h-4 w-4 mr-1" />
          Category:
        </span>
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.value}
            variant={category === cat.value ? "default" : "outline"}
            className="h-9 border-border px-3 text-xs sm:text-sm"
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="mb-3 text-sm text-muted-foreground">
        Showing {filtered.length} of {enquiries.length} enquiries
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((e) => (
          <div key={e.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-foreground">{e.name || "-"}</p>
                <p className="text-xs text-muted-foreground">{e.phone || "-"}</p>
              </div>
              <Badge variant="outline" className={categoryBadgeClass[e.subject] || ""}>
                {e.subject || "-"}
              </Badge>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Email:</span> {e.email || "-"}</p>
              <p><span className="font-medium text-foreground">Center:</span> {e.center || "-"}</p>
              {e.message && (
                <p><span className="font-medium text-foreground">Message:</span> {e.message}</p>
              )}
              <p><span className="font-medium text-foreground">Submitted:</span> {formatDateTime(e.createdAt)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 h-9 w-full border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
              onClick={() => deleteEnquiry(e._id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        ))}
        {!filtered.length && !loading && (
          <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            No enquiries found.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <DataTable
        className="hidden md:block"
        columns={[
          { key: "name", header: "Name", render: (e) => e.name || "-" },
          { key: "phone", header: "Phone", render: (e) => e.phone || "-" },
          { key: "email", header: "Email", render: (e) => e.email || "-" },
          { key: "center", header: "Center", render: (e) => e.center || "-" },
          {
            key: "subject",
            header: "Category",
            render: (e) => (
              <Badge variant="outline" className={categoryBadgeClass[e.subject] || ""}>
                {e.subject || "-"}
              </Badge>
            ),
          },
          {
            key: "message",
            header: "Message",
            render: (e) => (
              <span className="block max-w-xs whitespace-pre-wrap break-words">
                {e.message || "-"}
              </span>
            ),
          },
          {
            key: "createdAt",
            header: "Submitted",
            render: (e) => (
              <span className="whitespace-nowrap">{formatDateTime(e.createdAt)}</span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            render: (e) => (
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-rose-500/40 px-2 text-xs text-rose-400 hover:bg-rose-500/10"
                onClick={() => deleteEnquiry(e._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            ),
          },
        ]}
        data={filtered}
      />

      {loading && <p className="mt-4 text-muted-foreground">Loading enquiries...</p>}

      {!loading && !enquiries.length && (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          <Inbox className="h-8 w-8" />
          No enquiries received yet.
        </div>
      )}
    </div>
  );
};

export default EnquiriesPage;
