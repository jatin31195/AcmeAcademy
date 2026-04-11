import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Pencil,
  ShieldCheck,
  Phone,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  Lock,
  Unlock,
  Download,
  ExternalLink,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/config";

const API = `${BASE_URL}/api/admin/users`;

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadgeClass = {
  verified: "bg-emerald-500/15 border-emerald-400 text-emerald-300",
  pending: "bg-amber-500/15 border-amber-400 text-amber-300",
  rejected: "bg-rose-500/15 border-rose-400 text-rose-300",
};

const truthy = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const getDocumentItems = (user) => {
  const vp = user?.verificationProfile || {};
  const forms = Array.isArray(vp.applicationForms)
    ? vp.applicationForms.map((form, index) => ({
        label: `Application Form${form?.exam ? ` (${form.exam})` : ""}`,
        url: form?.fileUrl || "",
        key: `application-${form?._id || index}`,
      }))
    : [];

  return [
    { key: "profile", label: "Profile Photo", url: user?.profilePic || "" },
    { key: "id-front", label: "ID Front", url: vp.idFrontUrl || "" },
    { key: "id-back", label: "ID Back", url: vp.idBackUrl || "" },
    { key: "marksheet", label: "Marksheet", url: vp.marksheetUrl || "" },
    { key: "passport", label: "Passport Photo", url: vp.passportPhotoUrl || "" },
    { key: "latest", label: "Latest Photo", url: vp.latestPhotoUrl || "" },
    { key: "live-photo", label: "Live Photo Capture", url: vp.livePhotoDataUrl || "" },
    { key: "signature", label: "Signature", url: vp.signatureDataUrl || "" },
    {
      key: "profile-card",
      label: "Profile Card Preview",
      url: vp.downloadProfileCardDataUrl || "",
    },
    ...forms,
  ];
};

const DocumentCard = ({ label, url }) => {
  const hasUrl = Boolean(url);
  const normalized = String(url || "").toLowerCase();
  const isImage =
    hasUrl &&
    (normalized.startsWith("data:image/") ||
      /\.(png|jpg|jpeg|webp|gif|svg)(\?|$)/i.test(normalized));

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      {hasUrl ? (
        <>
          {isImage ? (
            <div className="mt-2 h-36 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
              <img
                src={url}
                alt={label}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mt-2 h-36 rounded-lg border border-slate-700 bg-slate-950 grid place-items-center text-slate-400 text-sm">
              File preview unavailable
            </div>
          )}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
          >
            <ExternalLink className="h-4 w-4" />
            {isImage ? "Open Image" : "Open File"}
          </a>
        </>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Not uploaded</p>
      )}
    </div>
  );
};

const isPreviewableImage = (url) => {
  const normalized = String(url || "").toLowerCase();
  return (
    normalized.startsWith("data:image/") ||
    /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(normalized)
  );
};

const loadImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const getFileName = (url, fallbackLabel = "document") => {
  if (!url) return fallbackLabel;
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || fallbackLabel;
  } catch {
    const parts = String(url).split("/").filter(Boolean);
    return parts[parts.length - 1] || fallbackLabel;
  }
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [verificationSaving, setVerificationSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [filter, setFilter] = useState("all");

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || "").toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" ? true : u.verificationStatus === filter;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const openDetails = async (userId) => {
    try {
      const res = await fetch(`${API}/${userId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load user details");

      setActiveUser(data.user);
      setDetailsOpen(true);
    } catch (err) {
      alert(err.message || "Unable to fetch user details");
    }
  };

  const openEdit = async (userId) => {
    try {
      const res = await fetch(`${API}/${userId}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load user details");

      const user = data.user;
      const vp = user.verificationProfile || {};

      setActiveUser(user);
      setEditForm({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob ? String(user.dob).slice(0, 10) : "",
        whatsapp: user.whatsapp || "",
        gender: user.gender || "",
        fatherName: user.fatherName || "",
        collegeName: user.collegeName || "",
        nimcetApplicationId: user.nimcetApplicationId || "",
        targetExam: user.targetExam || "",
        targetYear: user.targetYear || "",
        verificationStatus: user.verificationStatus || "pending",
        verificationProfileLocked: user.verificationProfileLocked,
        verificationProfileSubmitted: user.verificationProfileSubmitted,
        verificationMobile: vp.mobile || "",
        address: vp.address || "",
        verificationTargetExam: vp.targetExam || "",
        verificationTargetYear: vp.targetYear || "",
        courseEnrolled: vp.courseEnrolled || "",
        batchesEnrolled: vp.batchesEnrolled || "",
        vpFatherName: vp.fatherName || "",
        vpMotherName: vp.motherName || "",
        parentsContact: vp.parentsContact || "",
        city: vp.city || "",
        state: vp.state || "",
        idType: vp.idType || "",
        termsAccepted: vp.termsAccepted,
      });
      setEditOpen(true);
    } catch (err) {
      alert(err.message || "Unable to load user for edit");
    }
  };

  const downloadStudentDataCard = async () => {
    if (!activeUser?._id) return;

    const vp = activeUser.verificationProfile || {};
    const documents = getDocumentItems(activeUser);
    const documentPreviews = await Promise.all(
      documents.map(async (document) => ({
        ...document,
        image: isPreviewableImage(document.url) ? await loadImage(document.url) : null,
      }))
    );

    const overviewFields = [
      ["Full Name", activeUser.fullname],
      ["Username", activeUser.username],
      ["Email", activeUser.email],
      ["Phone", activeUser.phone],
      ["WhatsApp", activeUser.whatsapp],
      ["DOB", formatDate(activeUser.dob)],
      ["Gender", activeUser.gender],
      ["Father Name", activeUser.fatherName],
      ["College", activeUser.collegeName],
      ["Application ID", activeUser.nimcetApplicationId],
      ["Target Exam", activeUser.targetExam],
      ["Target Year", activeUser.targetYear],
      ["Joined", formatDate(activeUser.createdAt)],
      ["Last Updated", formatDate(activeUser.updatedAt)],
    ];

    const verificationFields = [
      ["Verification Status", activeUser.verificationStatus],
      ["Locked", activeUser.verificationProfileLocked ? "Yes" : "No"],
      ["Submitted", activeUser.verificationProfileSubmitted ? "Yes" : "No"],
      ["Submitted At", formatDate(activeUser.verificationSubmittedAt)],
      ["Mobile", vp.mobile],
      ["Address", vp.address],
      ["Target Exam", vp.targetExam],
      ["Target Year", vp.targetYear],
      ["Course Enrolled", vp.courseEnrolled],
      ["Batches Enrolled", vp.batchesEnrolled],
      ["Father Name", vp.fatherName],
      ["Mother Name", vp.motherName],
      ["Parents Contact", vp.parentsContact],
      ["City", vp.city],
      ["State", vp.state],
      ["ID Type", vp.idType],
      ["Terms Accepted", vp.termsAccepted ? "Yes" : "No"],
    ];

    const overviewRows = Math.ceil(overviewFields.length / 2);
    const verificationRows = Math.ceil(verificationFields.length / 2);
    const docRows = Math.ceil(documentPreviews.length / 3);
    const canvasWidth = 1600;
    const canvasHeight = 360 + overviewRows * 96 + verificationRows * 96 + docRows * 228 + 220;

    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bg.addColorStop(0, "#f8f7ff");
    bg.addColorStop(0.45, "#f4f0ff");
    bg.addColorStop(1, "#fff7fb");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const topBar = ctx.createLinearGradient(0, 0, canvasWidth, 0);
    topBar.addColorStop(0, "#7c3aed");
    topBar.addColorStop(0.5, "#9333ea");
    topBar.addColorStop(1, "#ec4899");
    ctx.fillStyle = topBar;
    ctx.fillRect(0, 0, canvasWidth, 10);

    ctx.fillStyle = "rgba(124,58,237,0.06)";
    for (let x = 50; x < canvasWidth; x += 42) {
      for (let y = 50; y < canvasHeight; y += 42) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawSectionTitle = (title, subtitle, y) => {
      ctx.font = "bold 20px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      ctx.fillText(title, 70, y);
      if (subtitle) {
        ctx.font = "500 11px Georgia, serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(subtitle, 70, y + 18);
      }
    };

    const drawFieldCard = (label, value, x, y, width = 710) => {
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.beginPath();
      ctx.roundRect(x, y, width, 74, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(124,58,237,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, width, 74, 16);
      ctx.stroke();

      ctx.font = "600 10px Georgia, serif";
      ctx.fillStyle = "#8b5cf6";
      ctx.fillText(label.toUpperCase(), x + 16, y + 22);

      ctx.font = "bold 18px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      const text = String(value || "-");
      const safeText = text.length > 34 ? `${text.slice(0, 31)}...` : text;
      ctx.fillText(safeText, x + 16, y + 50);
    };

    const drawDocumentCard = (document, x, y, width = 460, height = 200) => {
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(124,58,237,0.14)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, 18);
      ctx.stroke();

      ctx.font = "700 12px Georgia, serif";
      ctx.fillStyle = "#7c3aed";
      ctx.fillText(document.label, x + 16, y + 24);

      if (document.url && document.image) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x + 16, y + 38, width - 32, 118, 14);
        ctx.clip();
        const image = document.image;
        const imageRatio = image.width / image.height;
        const frameRatio = (width - 32) / 118;
        let drawWidth = width - 32;
        let drawHeight = 118;
        let drawX = x + 16;
        let drawY = y + 38;

        if (imageRatio > frameRatio) {
          drawHeight = (width - 32) / imageRatio;
          drawY = y + 38 + (118 - drawHeight) / 2;
        } else {
          drawWidth = 118 * imageRatio;
          drawX = x + 16 + ((width - 32) - drawWidth) / 2;
        }

        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath();
        ctx.roundRect(x + 16, y + 38, width - 32, 118, 14);
        ctx.fill();
        ctx.strokeStyle = "rgba(148,163,184,0.45)";
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.roundRect(x + 16, y + 38, width - 32, 118, 14);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = "bold 26px Georgia, serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(document.url ? "PDF" : "—", x + 26, y + 104);

        ctx.font = "600 11px Georgia, serif";
        ctx.fillStyle = "#475569";
        ctx.fillText(document.url ? getFileName(document.url, document.label) : "Not uploaded", x + 76, y + 100);

        ctx.font = "500 10px Georgia, serif";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(document.url ? "Preview shown as file card" : "No document attached", x + 76, y + 118);
      }
    };

    const logoImg = await loadImage("/logo.png");

    ctx.fillStyle = "rgba(124,58,237,0.12)";
    ctx.beginPath();
    ctx.arc(80, 82, 34, 0, Math.PI * 2);
    ctx.fill();

    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(80, 82, 30, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, 50, 52, 60, 60);
      ctx.restore();
    }

    ctx.font = "bold 24px Georgia, serif";
    ctx.fillStyle = "#1e1b4b";
    ctx.fillText("ACME", 130, 70);
    ctx.font = "600 12px Georgia, serif";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText("ACADEMY", 130, 90);
    ctx.font = "500 10px Georgia, serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Admin Complete Student Data Export", 130, 108);

    ctx.fillStyle = "rgba(124,58,237,0.08)";
    ctx.beginPath();
    ctx.roundRect(70, 130, 1460, 92, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.14)";
    ctx.beginPath();
    ctx.roundRect(70, 130, 1460, 92, 22);
    ctx.stroke();

    ctx.font = "bold 28px Georgia, serif";
    ctx.fillStyle = "#1e1b4b";
    ctx.fillText(activeUser.fullname || activeUser.username || "Student", 100, 180);

    ctx.font = "500 12px Georgia, serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(activeUser.email || "-", 100, 205);

    ctx.font = "600 12px Georgia, serif";
    ctx.fillStyle = "#065f46";
    ctx.fillText(`Verification Status: ${activeUser.verificationStatus || "pending"}`, 820, 180);
    ctx.fillText(`Profile Lock: ${activeUser.verificationProfileLocked ? "Locked" : "Unlocked"}`, 820, 202);

    let currentY = 260;
    drawSectionTitle("Overview", "Primary account and profile data", currentY);
    currentY += 34;

    overviewFields.forEach((field, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = col === 0 ? 70 : 820;
      const y = currentY + row * 96;
      drawFieldCard(field[0], field[1], x, y);
    });

    currentY = currentY + overviewRows * 96 + 52;
    drawSectionTitle("Verification", "Complete submitted profile snapshot", currentY);
    currentY += 34;

    verificationFields.forEach((field, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = col === 0 ? 70 : 820;
      const y = currentY + row * 96;
      drawFieldCard(field[0], field[1], x, y);
    });

    currentY = currentY + verificationRows * 96 + 60;
    drawSectionTitle("Uploaded Documents", "Preview cards for images and file tiles for PDFs", currentY);
    currentY += 34;

    documentPreviews.forEach((document, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = 70 + col * 490;
      const y = currentY + row * 228;
      drawDocumentCard(document, x, y);
    });

    const footerY = currentY + docRows * 228 + 40;
    ctx.fillStyle = "rgba(16,185,129,0.08)";
    ctx.beginPath();
    ctx.roundRect(70, footerY, 1460, 74, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(16,185,129,0.22)";
    ctx.beginPath();
    ctx.roundRect(70, footerY, 1460, 74, 18);
    ctx.stroke();

    ctx.font = "600 12px Georgia, serif";
    ctx.fillStyle = "#065f46";
    ctx.fillText("Generated from admin student records with attached document previews.", 92, footerY + 30);
    ctx.font = "500 11px Georgia, serif";
    ctx.fillStyle = "#047857";
    ctx.fillText(new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }), 92, footerY + 50);

    const link = document.createElement("a");
    link.download = `${(activeUser.fullname || activeUser.username || "student").replace(/\s+/g, "_")}-complete-data-card.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const onChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    if (!activeUser?._id) return;
    try {
      setSaving(true);
      const res = await fetch(`${API}/${activeUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      await fetchUsers();
      setActiveUser(data.user);
      setEditOpen(false);
      setDetailsOpen(true);
    } catch (err) {
      alert(err.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const updateVerification = async (payload, successMessage) => {
    if (!activeUser?._id) return;
    try {
      setVerificationSaving(true);
      const res = await fetch(`${API}/${activeUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update verification");

      setActiveUser(data.user);
      await fetchUsers();
      if (successMessage) alert(successMessage);
    } catch (err) {
      alert(err.message || "Unable to update verification");
    } finally {
      setVerificationSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="User Control Center"
        description="Admin-only visibility and updates for complete student records."
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-200">
          <ShieldCheck className="h-4 w-4" />
          Admin Exclusive Edits
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="h-10 pl-10 bg-secondary border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className="h-9 border-border px-3 text-xs sm:text-sm"
            onClick={() => setFilter("all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={filter === "verified" ? "default" : "outline"}
            className="h-9 border-border px-3 text-xs sm:text-sm"
            onClick={() => setFilter("verified")}
          >
            Verified
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            className="h-9 border-border px-3 text-xs sm:text-sm"
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            className="h-9 border-border px-3 text-xs sm:text-sm"
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Users List/Table */}
      <div className="space-y-4">
        <div className="grid gap-3 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {user.name || user.fullname || user.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email || "-"}</p>
                </div>
                <Badge
                  variant="outline"
                  className={statusBadgeClass[user.verificationStatus] || ""}
                >
                  {user.verificationStatus || "pending"}
                </Badge>
              </div>

              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Phone:</span> {user.phone || "-"}</p>
                <p><span className="font-medium text-foreground">Edit Lock:</span> {user.verificationProfileLocked ? "Locked" : "Unlocked"}</p>
                <p><span className="font-medium text-foreground">Joined:</span> {user.joined || formatDate(user.createdAt)}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 flex-1 border-border"
                  onClick={() => openDetails(user.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="gradient-primary h-9 flex-1 text-primary-foreground"
                  onClick={() => openEdit(user.id)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          ))}

          {!filteredUsers.length && !loading && (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
              No users found.
            </div>
          )}
        </div>

        <DataTable
          className="hidden md:block"
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            {
              key: "phone",
              header: "Phone",
              render: (user) => user.phone || "-",
            },
            {
              key: "verificationStatus",
              header: "Verification",
              render: (user) => (
                <Badge
                  variant="outline"
                  className={statusBadgeClass[user.verificationStatus] || ""}
                >
                  {user.verificationStatus || "pending"}
                </Badge>
              ),
            },
            {
              key: "lock",
              header: "Edit Lock",
              render: (user) => (
                <Badge variant={user.verificationProfileLocked ? "default" : "secondary"}>
                  {user.verificationProfileLocked ? "Locked" : "Unlocked"}
                </Badge>
              ),
            },
            { key: "joined", header: "Joined" },
            {
              key: "actions",
              header: "Actions",
              render: (user) => (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border px-2 text-xs"
                    onClick={() => openDetails(user.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="gradient-primary h-8 px-2 text-xs text-primary-foreground"
                    onClick={() => openEdit(user.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              ),
            },
          ]}
          data={filteredUsers}
        />
      </div>

      {loading && <p className="mt-4 text-muted-foreground">Loading users...</p>}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto border border-white/20 bg-gradient-to-br from-slate-900/85 via-slate-900/80 to-indigo-950/75 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
          <DialogHeader className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <DialogTitle className="text-xl sm:text-2xl">
                  {activeUser?.fullname || activeUser?.username || "User"}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1"><Mail className="h-4 w-4" /> {activeUser?.email || "-"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1"><Phone className="h-4 w-4" /> {activeUser?.phone || "-"}</span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1"><User className="h-4 w-4" /> {activeUser?.username || "-"}</span>
                  <Badge variant="outline" className={statusBadgeClass[activeUser?.verificationStatus] || ""}>
                    {activeUser?.verificationStatus || "pending"}
                  </Badge>
                </div>
              </div>

              <Button
                type="button"
                onClick={downloadStudentDataCard}
                className="gradient-primary w-full text-primary-foreground sm:w-auto shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Complete Data
              </Button>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur">
              <TabsTrigger className="data-[state=active]:bg-white/20 data-[state=active]:text-white" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-white/20 data-[state=active]:text-white" value="verification">Verification</TabsTrigger>
              <TabsTrigger className="data-[state=active]:bg-white/20 data-[state=active]:text-white" value="logs">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Full Name", activeUser?.fullname],
                  ["Username", activeUser?.username],
                  ["Email", activeUser?.email],
                  ["Phone", activeUser?.phone],
                  ["WhatsApp", activeUser?.whatsapp],
                  ["DOB", formatDate(activeUser?.dob)],
                  ["Gender", activeUser?.gender],
                  ["Father Name", activeUser?.fatherName],
                  ["College", activeUser?.collegeName],
                  ["Application ID", activeUser?.nimcetApplicationId],
                  ["Target Exam", activeUser?.targetExam],
                  ["Target Year", activeUser?.targetYear],
                  ["Joined", formatDate(activeUser?.createdAt)],
                  ["Last Updated", formatDate(activeUser?.updatedAt)],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 font-medium text-slate-100">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="verification" className="mt-4">
              <div className="mb-4 rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
                  Verification Decision Panel
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Verification Status</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={verificationSaving}
                        variant={activeUser?.verificationStatus === "verified" ? "default" : "outline"}
                        className={activeUser?.verificationStatus === "verified" ? "bg-emerald-600 hover:bg-emerald-500" : "border-slate-600"}
                        onClick={() =>
                          updateVerification(
                            {
                              verificationStatus: "verified",
                              verificationProfileLocked: true,
                            },
                            "User verification approved"
                          )
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        disabled={verificationSaving}
                        variant={activeUser?.verificationStatus === "rejected" ? "default" : "outline"}
                        className={activeUser?.verificationStatus === "rejected" ? "bg-rose-600 hover:bg-rose-500" : "border-slate-600"}
                        onClick={() =>
                          updateVerification(
                            {
                              verificationStatus: "rejected",
                              verificationProfileLocked: false,
                            },
                            "User verification rejected"
                          )
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>

                      <Button
                        size="sm"
                        disabled={verificationSaving}
                        variant={activeUser?.verificationStatus === "pending" ? "default" : "outline"}
                        className={activeUser?.verificationStatus === "pending" ? "bg-amber-600 hover:bg-amber-500" : "border-slate-600"}
                        onClick={() =>
                          updateVerification(
                            { verificationStatus: "pending" },
                            "Verification marked pending"
                          )
                        }
                      >
                        <Clock3 className="h-4 w-4 mr-1" />
                        Pending
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-2">Profile Edit Lock</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={verificationSaving}
                        variant={activeUser?.verificationProfileLocked ? "default" : "outline"}
                        className={activeUser?.verificationProfileLocked ? "bg-violet-600 hover:bg-violet-500" : "border-slate-600"}
                        onClick={() =>
                          updateVerification(
                            { verificationProfileLocked: true },
                            "Verification profile locked"
                          )
                        }
                      >
                        <Lock className="h-4 w-4 mr-1" />
                        Lock
                      </Button>
                      <Button
                        size="sm"
                        disabled={verificationSaving}
                        variant={!activeUser?.verificationProfileLocked ? "default" : "outline"}
                        className={!activeUser?.verificationProfileLocked ? "bg-slate-600 hover:bg-slate-500" : "border-slate-600"}
                        onClick={() =>
                          updateVerification(
                            { verificationProfileLocked: false },
                            "Verification profile unlocked"
                          )
                        }
                      >
                        <Unlock className="h-4 w-4 mr-1" />
                        Unlock
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Locked", activeUser?.verificationProfileLocked ? "Yes" : "No"],
                  ["Submitted", activeUser?.verificationProfileSubmitted ? "Yes" : "No"],
                  ["Submitted At", formatDate(activeUser?.verificationSubmittedAt)],
                  ["Mobile", activeUser?.verificationProfile?.mobile],
                  ["Address", activeUser?.verificationProfile?.address],
                  ["Course", activeUser?.verificationProfile?.courseEnrolled],
                  ["Batches", activeUser?.verificationProfile?.batchesEnrolled],
                  ["VP Father Name", activeUser?.verificationProfile?.fatherName],
                  ["VP Mother Name", activeUser?.verificationProfile?.motherName],
                  ["Parents Contact", activeUser?.verificationProfile?.parentsContact],
                  ["City", activeUser?.verificationProfile?.city],
                  ["State", activeUser?.verificationProfile?.state],
                  ["ID Type", activeUser?.verificationProfile?.idType],
                  ["Terms Accepted", activeUser?.verificationProfile?.termsAccepted ? "Yes" : "No"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 font-medium text-slate-100">{value || "-"}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
                  Uploaded Photos And Documents
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {getDocumentItems(activeUser).map((doc) => (
                    <DocumentCard key={doc.key} label={doc.label} url={doc.url} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="space-y-3">
                {(activeUser?.activityLogs || []).slice(-20).reverse().map((log, index) => (
                  <div key={`${log.action}-${index}`} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-100">{log.action}</p>
                      <p className="text-xs text-slate-400">{formatDate(log.at)}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-300">{log.message || "-"}</p>
                  </div>
                ))}
                {!activeUser?.activityLogs?.length && (
                  <p className="text-slate-400">No activity logs available.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border border-white/20 bg-gradient-to-br from-slate-900/85 via-slate-900/80 to-cyan-950/70 text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
          <DialogHeader className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <DialogTitle>Edit User Details (Admin Only)</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["fullname", "Full Name"],
              ["username", "Username"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["dob", "DOB (yyyy-mm-dd)"],
              ["whatsapp", "WhatsApp"],
              ["gender", "Gender"],
              ["fatherName", "Father Name"],
              ["collegeName", "College Name"],
              ["nimcetApplicationId", "Application ID"],
              ["targetExam", "Target Exam"],
              ["targetYear", "Target Year"],
              ["verificationStatus", "Verification Status"],
              ["verificationMobile", "Verification Mobile"],
              ["address", "Address"],
              ["verificationTargetExam", "Verification Target Exam"],
              ["verificationTargetYear", "Verification Target Year"],
              ["courseEnrolled", "Course Enrolled"],
              ["batchesEnrolled", "Batches Enrolled"],
              ["vpFatherName", "VP Father Name"],
              ["vpMotherName", "VP Mother Name"],
              ["parentsContact", "Parents Contact"],
              ["city", "City"],
              ["state", "State"],
              ["idType", "ID Type"],
              ["verificationProfileLocked", "Verification Locked (true/false)"],
              ["verificationProfileSubmitted", "Verification Submitted (true/false)"],
              ["termsAccepted", "Terms Accepted (true/false)"],
            ].map(([key, label]) => {
              const isBooleanField =
                key === "verificationProfileLocked" ||
                key === "verificationProfileSubmitted" ||
                key === "termsAccepted";

              const isVerificationStatusField = key === "verificationStatus";

              return (
              <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <p className="mb-1 text-xs text-slate-300">{label}</p>
                {isVerificationStatusField ? (
                  <div className="flex flex-wrap gap-2">
                    {[
                      ["pending", "Pending"],
                      ["verified", "Verified"],
                      ["rejected", "Rejected"],
                    ].map(([value, text]) => (
                      <Button
                        key={value}
                        type="button"
                        size="sm"
                        variant={editForm[key] === value ? "default" : "outline"}
                        className={editForm[key] === value ? "gradient-primary px-2 text-xs text-primary-foreground sm:px-3 sm:text-sm" : "border-border px-2 text-xs sm:px-3 sm:text-sm"}
                        onClick={() => onChange(key, value)}
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                ) : isBooleanField ? (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={truthy(editForm[key]) ? "default" : "outline"}
                      className={truthy(editForm[key]) ? "bg-emerald-600 px-2 text-xs text-white hover:bg-emerald-500 sm:px-3 sm:text-sm" : "border-border px-2 text-xs sm:px-3 sm:text-sm"}
                      onClick={() => onChange(key, true)}
                    >
                      True
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={!truthy(editForm[key]) ? "default" : "outline"}
                      className={!truthy(editForm[key]) ? "bg-rose-600 px-2 text-xs text-white hover:bg-rose-500 sm:px-3 sm:text-sm" : "border-border px-2 text-xs sm:px-3 sm:text-sm"}
                      onClick={() => onChange(key, false)}
                    >
                      False
                    </Button>
                  </div>
                ) : (
                  <Input
                    value={String(editForm[key] ?? "")}
                    onChange={(e) => onChange(key, e.target.value)}
                    className="border-white/20 bg-white/10"
                  />
                )}
              </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button className="w-full sm:w-auto" variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving} className="gradient-primary w-full text-primary-foreground sm:w-auto">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
