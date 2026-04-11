import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Calendar,
  User,
  Edit2,
  X,
  GraduationCap,
  Target,
  BookOpen,
  Hash,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { BASE_URL } from "../../config";
import { useUser } from "../../UserContext"; 
import { useNavigate } from "react-router-dom";

const API_BASE = `${BASE_URL}/api/users`;

const isImageSource = (value) => {
  const normalized = String(value || "").toLowerCase();
  return (
    normalized.startsWith("data:image/") ||
    /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(normalized)
  );
};

const MediaCard = ({ title, url }) => {
  const hasUrl = Boolean(url);
  const image = hasUrl && isImageSource(url);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>

      {hasUrl ? (
        <>
          {image ? (
            <div className="mt-3 h-36 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img src={url} alt={title} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ) : (
            <div className="mt-3 grid h-36 place-items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
              File preview unavailable
            </div>
          )}

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ExternalLink className="h-4 w-4" />
            {image ? "Open image" : "Open file"}
          </a>
        </>
      ) : (
        <p className="mt-3 text-sm text-gray-500">Not uploaded</p>
      )}
    </div>
  );
};

const UserProfileCard = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading, fetchUser } = useUser(); 

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState("");

  const isVerificationLocked =
    !!user?.verificationProfileLocked || !!user?.verificationProfileSubmitted;
  const isVerified = user?.verificationStatus === "verified";

  const verificationSummary = useMemo(
    () =>
      user?.verificationSummary || {
        name: user?.fullname || "",
        mobile: user?.phone || user?.whatsapp || "",
        email: user?.email || "",
        address: "",
        targetExam: user?.targetExam || "",
        targetYear: user?.targetYear || "",
        courseEnrolled: "",
        verificationMedia: {},
      },
    [user]
  );

  const verificationAssets = useMemo(() => {
    const media = verificationSummary.verificationMedia || {};
    const applicationForms = Array.isArray(media.applicationForms)
      ? media.applicationForms
      : [];

    return [
      { title: "Profile Photo", url: media.profilePic || user?.profilePic || "" },
      { title: "ID Front", url: media.idFrontUrl || "" },
      { title: "ID Back", url: media.idBackUrl || "" },
      { title: "Marksheet", url: media.marksheetUrl || "" },
      { title: "Passport Photo", url: media.passportPhotoUrl || "" },
      { title: "Latest Photo", url: media.latestPhotoUrl || "" },
      { title: "Live Photo", url: media.livePhotoDataUrl || "" },
      { title: "Signature", url: media.signatureDataUrl || "" },
      {
        title: "Profile Card Preview",
        url: media.downloadProfileCardDataUrl || verificationSummary.downloadProfileCardDataUrl || "",
      },
      ...applicationForms.map((form, index) => ({
        title: `Application Form${form?.exam ? ` (${form.exam})` : ""}`,
        url: form?.fileUrl || "",
        key: `application-${form?.id || index}`,
      })),
    ];
  }, [user?.profilePic, verificationSummary]);

  // 🔹 Initialize edit data when user context loads
  useEffect(() => {
    if (user) {
      setEditData({
        fullname: user.fullname || "",
        dob: user.dob ? user.dob.slice(0, 10) : "",
        gender: user.gender || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
        targetExam: user.targetExam || "",
        targetYear: user.targetYear || "",
        fatherName: user.fatherName || "",
        collegeName: user.collegeName || "",
        nimcetApplicationId: user.nimcetApplicationId || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setAvatarFile(files[0]);
      setEditData((prev) => ({
        ...prev,
        profilePic: URL.createObjectURL(files[0]),
      }));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (isVerificationLocked) {
      setStatus("❌ Profile is locked. Contact admin for changes.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(editData).forEach((key) => {
        if (key !== "profilePic" && editData[key]) {
          formData.append(key, editData[key]);
        }
      });
      if (avatarFile) formData.append("profilePic", avatarFile);

      await axios.patch(`${API_BASE}/update-profile`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("✅ Profile updated successfully!");
      setIsEditing(false);
      fetchUser(); // ✅ Refresh global user data
    } catch (err) {
      console.error("Update failed:", err);
      setStatus("❌ Failed to update profile.");
    }
  };

  const handleDownloadProfile = () => {
    if (verificationSummary.downloadProfileCardDataUrl) {
      const link = document.createElement("a");
      link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
      link.href = verificationSummary.downloadProfileCardDataUrl;
      link.click();
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 760;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 1000, 760);
    bg.addColorStop(0, "#f8f7ff");
    bg.addColorStop(0.55, "#f3f0ff");
    bg.addColorStop(1, "#fdf2f8");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1000, 760);

    const topBar = ctx.createLinearGradient(0, 0, 1000, 0);
    topBar.addColorStop(0, "#9333ea");
    topBar.addColorStop(0.5, "#7c3aed");
    topBar.addColorStop(1, "#ec4899");
    ctx.fillStyle = topBar;
    ctx.fillRect(0, 0, 1000, 8);

    ctx.fillStyle = "rgba(124,58,237,0.06)";
    for (let x = 50; x < 1000; x += 40) {
      for (let y = 50; y < 760; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const drawLabelValue = (label, value, x, y, w = 420) => {
      ctx.fillStyle = "rgba(124,58,237,0.05)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, 72, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(124,58,237,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, 72, 12);
      ctx.stroke();

      ctx.font = "600 10px Georgia, serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText(label.toUpperCase(), x + 16, y + 22);

      ctx.font = "bold 18px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      const safeValue = String(value || "-");
      ctx.fillText(safeValue.length > 34 ? `${safeValue.slice(0, 31)}...` : safeValue, x + 16, y + 50);
    };

    const rows = [
      ["Student Name", verificationSummary.name || "-"],
      ["Mobile", verificationSummary.mobile || "-"],
      ["Email", verificationSummary.email || "-"],
      ["Target Exam", verificationSummary.targetExam || "-"],
      ["Target Year", verificationSummary.targetYear || "-"],
      ["Course Enrolled", verificationSummary.courseEnrolled || "-"],
      ["Address", verificationSummary.address || "-"],
    ];

    const finish = (logoImg) => {
      ctx.fillStyle = "rgba(124,58,237,0.1)";
      ctx.beginPath();
      ctx.arc(72, 62, 30, 0, Math.PI * 2);
      ctx.fill();

      if (logoImg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(72, 62, 27, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, 45, 35, 54, 54);
        ctx.restore();
      }

      ctx.font = "bold 22px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      ctx.fillText("ACME", 115, 56);
      ctx.font = "600 11px Georgia, serif";
      ctx.fillStyle = "#7c3aed";
      ctx.fillText("ACADEMY", 115, 74);
      ctx.font = "500 10px Georgia, serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText("acmeacademy.in", 115, 90);

      ctx.strokeStyle = "rgba(124,58,237,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(52, 110);
      ctx.lineTo(948, 110);
      ctx.stroke();

      ctx.fillStyle = "rgba(124,58,237,0.1)";
      ctx.beginPath();
      ctx.roundRect(52, 124, 220, 28, 6);
      ctx.fill();
      ctx.strokeStyle = "rgba(124,58,237,0.25)";
      ctx.beginPath();
      ctx.roundRect(52, 124, 220, 28, 6);
      ctx.stroke();
      ctx.font = "bold 11px Georgia, serif";
      ctx.fillStyle = "#7c3aed";
      ctx.fillText("USER VERIFICATION PROFILE", 66, 143);

      drawLabelValue(rows[0][0], rows[0][1], 52, 172, 430);
      drawLabelValue(rows[1][0], rows[1][1], 514, 172, 434);
      drawLabelValue(rows[2][0], rows[2][1], 52, 260, 430);
      drawLabelValue(rows[3][0], rows[3][1], 514, 260, 434);
      drawLabelValue(rows[4][0], rows[4][1], 52, 348, 280);
      drawLabelValue(rows[5][0], rows[5][1], 350, 348, 180);
      drawLabelValue(rows[6][0], rows[6][1], 548, 348, 400);
      drawLabelValue(rows[7][0], rows[7][1], 52, 436, 896);

      ctx.fillStyle = "rgba(16,185,129,0.08)";
      ctx.beginPath();
      ctx.roundRect(52, 532, 896, 56, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(16,185,129,0.24)";
      ctx.beginPath();
      ctx.roundRect(52, 532, 896, 56, 12);
      ctx.stroke();

      const acceptedBy = verificationSummary.name || verificationSummary.username || "Student";

      ctx.font = "600 12px Georgia, serif";
      ctx.fillStyle = "#065f46";
      ctx.fillText(
        `I, ${acceptedBy}, confirm that I have accepted the Terms and Conditions for the above data.`,
        72,
        566
      );

      ctx.fillStyle = "rgba(124,58,237,0.05)";
      ctx.beginPath();
      ctx.roundRect(52, 602, 420, 90, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(124,58,237,0.2)";
      ctx.beginPath();
      ctx.roundRect(52, 602, 420, 90, 12);
      ctx.stroke();
      ctx.font = "600 10px Georgia, serif";
      ctx.fillStyle = "#9ca3af";
      ctx.fillText("STUDENT SIGNATURE", 70, 625);

      if (verificationSummary.signatureDataUrl) {
        const signImg = new Image();
        signImg.onload = () => {
          ctx.drawImage(signImg, 70, 632, 180, 42);
          ctx.font = "bold 12px Georgia, serif";
          ctx.fillStyle = "#1e1b4b";
          ctx.fillText(acceptedBy, 70, 686);
          const link = document.createElement("a");
          link.download = `${verificationSummary.username || "user"}-verification-profile.jpg`;
          link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.92);
          link.click();
        };
        signImg.onerror = () => {
          ctx.font = "bold 12px Georgia, serif";
          ctx.fillStyle = "#1e1b4b";
          ctx.fillText(acceptedBy, 70, 686);
          const link = document.createElement("a");
          link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.92);
          link.click();
        };
        signImg.src = verificationSummary.signatureDataUrl;
        return;
      }

      ctx.font = "bold 12px Georgia, serif";
      ctx.fillStyle = "#1e1b4b";
      ctx.fillText(acceptedBy, 70, 686);

      const link = document.createElement("a");
      link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    };

    const logo = new Image();
    logo.onload = () => finish(logo);
    logo.onerror = () => finish(null);
    logo.src = "/logo.png";
  };

  if (userLoading && !user)
    return (
      <div className="text-center py-20 text-gray-600">Loading profile...</div>
    );

  if (!user)
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 relative overflow-hidden text-center"
      >
        {/* Background glow (same style) */}
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>

        {/* Placeholder avatar */}
        <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
          ?
        </div>

        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
          Welcome to Dashboard
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          Please{" "}
          <a
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            login
          </a>{" "}
          to track your progress, update your profile, and unlock personalized insights.
        </p>
      </motion.div>
    </div>
  );


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-gray-200 rounded-3xl shadow-xl p-5 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>

        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-28 h-28 shrink-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-xl opacity-30 z-0"></div>
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              {editData.profilePic ? (
                <img
                  src={editData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {editData.fullname?.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
                {editData.fullname}
              </h2>
              {isVerified && (
                <CheckCircle2
                  className="h-6 w-6 text-blue-500"
                  aria-label="Verified user"
                  title="Verified"
                />
              )}
            </div>
            <p className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
              <Mail className="h-4 w-4 mr-2 opacity-70" />
              {editData.email}
            </p>

            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              {isVerificationLocked ? (
                <span className="text-indigo-700 font-medium">
                  Verification submitted. Student edits are locked.
                </span>
              ) : (
                <span className="text-amber-700 font-medium">
                  Verification pending. Complete profile verification once.
                </span>
              )}
            </div>

            {isVerificationLocked ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <InfoItem icon={User} label="Mobile" value={verificationSummary.mobile} />
                  <InfoItem icon={Target} label="Exam" value={verificationSummary.targetExam} />
                  <InfoItem icon={BookOpen} label="Year" value={verificationSummary.targetYear} />
                  <InfoItem icon={GraduationCap} label="Course" value={verificationSummary.courseEnrolled} />
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Verification Assets</p>
                      <p className="text-xs text-gray-500">
                        Uploaded documents and captures attached to this locked profile.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {verificationAssets.filter((item) => item.url).length} files available
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {verificationAssets.map((item) => (
                      <MediaCard key={`${item.title}-${item.url}`} title={item.title} url={item.url} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <InfoItem icon={Calendar} label="Born" value={editData.dob} />
                <InfoItem icon={User} label="Gender" value={editData.gender} />
                <InfoItem icon={Target} label="Exam" value={editData.targetExam} />
                <InfoItem icon={BookOpen} label="Year" value={editData.targetYear} />
                <InfoItem icon={User} label="Father" value={editData.fatherName} />
                <InfoItem
                  icon={GraduationCap}
                  label="College"
                  value={editData.collegeName}
                />
                <InfoItem
                  icon={Hash}
                  label="App ID"
                  value={editData.nimcetApplicationId}
                />
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-0 flex flex-col gap-2">
            {!isVerificationLocked && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            )}

            {!isVerificationLocked ? (
              <button
                onClick={() => navigate("/profile")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
              >
                Complete Verification
              </button>
            ) : (
              <button
                onClick={handleDownloadProfile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download User Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {status && (
        <p
          className={`text-center mt-4 ${
            status.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}

      {/* ✨ Edit Modal */}
      <AnimatePresence>
        {isEditing && !isVerificationLocked && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-y-auto relative p-8"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5 cursor-pointer" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
                Edit Your Profile
              </h2>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:w-1/3">
                  <label className="relative cursor-pointer w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
                    <img
                      src={editData.profilePic}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <input
                      type="file"
                      name="profilePic"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-sm text-white transition">
                      Upload
                    </div>
                  </label>
                  <p className="text-gray-500 text-sm mt-2">
                    Click to change profile photo
                  </p>
                </div>

                {/* Editable Fields */}
                <div className="flex-1 grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", name: "fullname", type: "text" },
                    { label: "Father Name", name: "fatherName", type: "text" },
                    { label: "College Name", name: "collegeName", type: "text" },
                    { label: "Target Exam", name: "targetExam", type: "text" },
                    { label: "Target Year", name: "targetYear", type: "number" },
                    {
                      label: "NIMCET Application ID",
                      name: "nimcetApplicationId",
                      type: "text",
                    },
                    { label: "Date of Birth", name: "dob", type: "date" },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-gray-700 font-medium mb-1">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={editData[f.name]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  ))}

                  {/* Gender */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8 gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
    <Icon className="h-4 w-4 text-gray-500 mr-2" />
    <span className="text-sm text-gray-700">{label}:</span>
    <span className="ml-auto text-sm font-semibold text-gray-800">
      {value || "-"}
    </span>
  </div>
);

export default UserProfileCard;
