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
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-secondary border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className="border-border"
            onClick={() => setFilter("all")}
          >
            <Filter className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button
            variant={filter === "verified" ? "default" : "outline"}
            className="border-border"
            onClick={() => setFilter("verified")}
          >
            Verified
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            className="border-border"
            onClick={() => setFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            className="border-border"
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() => openDetails(user.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="gradient-primary text-primary-foreground"
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

      {loading && <p className="mt-4 text-muted-foreground">Loading users...</p>}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {activeUser?.fullname || activeUser?.username || "User"}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" /> {activeUser?.email || "-"}</span>
              <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" /> {activeUser?.phone || "-"}</span>
              <span className="inline-flex items-center gap-1"><User className="h-4 w-4" /> {activeUser?.username || "-"}</span>
              <Badge variant="outline" className={statusBadgeClass[activeUser?.verificationStatus] || ""}>
                {activeUser?.verificationStatus || "pending"}
              </Badge>
            </div>
          </DialogHeader>

          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="bg-slate-800/80">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="logs">Activity</TabsTrigger>
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
                  <div key={label} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-1 font-medium text-slate-100">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="verification" className="mt-4">
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 mb-4">
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
                  <div key={label} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
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
                  <div key={`${log.action}-${index}`} className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-4">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Details (Admin Only)</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div key={key}>
                <p className="text-xs text-muted-foreground mb-1">{label}</p>
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
                        className={editForm[key] === value ? "gradient-primary text-primary-foreground" : "border-border"}
                        onClick={() => onChange(key, value)}
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                ) : isBooleanField ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={truthy(editForm[key]) ? "default" : "outline"}
                      className={truthy(editForm[key]) ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "border-border"}
                      onClick={() => onChange(key, true)}
                    >
                      True
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={!truthy(editForm[key]) ? "default" : "outline"}
                      className={!truthy(editForm[key]) ? "bg-rose-600 hover:bg-rose-500 text-white" : "border-border"}
                      onClick={() => onChange(key, false)}
                    >
                      False
                    </Button>
                  </div>
                ) : (
                  <Input
                    value={String(editForm[key] ?? "")}
                    onChange={(e) => onChange(key, e.target.value)}
                    className="bg-secondary border-border"
                  />
                )}
              </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving} className="gradient-primary text-primary-foreground">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
