"use client";

import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Calendar, User, Edit2, X, GraduationCap, Target, BookOpen, Hash, Download, ShieldCheck, CheckCircle2, type LucideIcon } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { useUser } from "@/providers/user-provider";

// Ported verbatim from client/src/components/Dashboard/UserProfileCard.jsx,
// including its canvas-based verification-card image generator (Client-only
// by nature — Canvas 2D API, next/image is not used for the canvas-drawn
// logo/signature images since they're loaded via `new Image()` for pixel
// manipulation, not display).
const API_BASE = `${BASE_URL}/api/users`;

type VerificationSummary = {
  name?: string;
  username?: string;
  mobile?: string;
  email?: string;
  address?: string;
  targetExam?: string;
  targetYear?: string;
  courseEnrolled?: string;
  downloadProfileCardDataUrl?: string;
  signatureDataUrl?: string;
};

const UserProfileCard = () => {
  const router = useRouter();
  const ctx = useUser();
  const user = ctx?.user;
  const userLoading = ctx?.loading;
  const fetchUser = ctx?.fetchUser;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const isVerificationLocked = !!user?.verificationProfileLocked || !!user?.verificationProfileSubmitted;
  const isVerified = user?.verificationStatus === "verified";

  const verificationSummary: VerificationSummary = useMemo(
    () =>
      (user?.verificationSummary as VerificationSummary) || {
        name: (user?.fullname as string) || "",
        mobile: (user?.phone as string) || (user?.whatsapp as string) || "",
        email: (user?.email as string) || "",
        address: "",
        targetExam: (user?.targetExam as string) || "",
        targetYear: (user?.targetYear as string) || "",
        courseEnrolled: "",
      },
    [user]
  );

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync local edit form from user context, ported behavior
      setEditData({
        fullname: (user.fullname as string) || "",
        dob: user.dob ? (user.dob as string).slice(0, 10) : "",
        gender: (user.gender as string) || "",
        email: (user.email as string) || "",
        profilePic: (user.profilePic as string) || "",
        targetExam: (user.targetExam as string) || "",
        targetYear: (user.targetYear as string) || "",
        fatherName: (user.fatherName as string) || "",
        collegeName: (user.collegeName as string) || "",
        nimcetApplicationId: (user.nimcetApplicationId as string) || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (name === "profilePic" && files?.[0]) {
      setAvatarFile(files[0]);
      setEditData((prev) => ({ ...prev, profilePic: URL.createObjectURL(files[0]) }));
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
      fetchUser?.();
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
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const bg = ctx2d.createLinearGradient(0, 0, 1000, 760);
    bg.addColorStop(0, "#f8f7ff");
    bg.addColorStop(0.55, "#f3f0ff");
    bg.addColorStop(1, "#fdf2f8");
    ctx2d.fillStyle = bg;
    ctx2d.fillRect(0, 0, 1000, 760);

    const topBar = ctx2d.createLinearGradient(0, 0, 1000, 0);
    topBar.addColorStop(0, "#9333ea");
    topBar.addColorStop(0.5, "#7c3aed");
    topBar.addColorStop(1, "#ec4899");
    ctx2d.fillStyle = topBar;
    ctx2d.fillRect(0, 0, 1000, 8);

    ctx2d.fillStyle = "rgba(124,58,237,0.06)";
    for (let x = 50; x < 1000; x += 40) {
      for (let y = 50; y < 760; y += 40) {
        ctx2d.beginPath();
        ctx2d.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx2d.fill();
      }
    }

    const drawLabelValue = (label: string, value: string, x: number, y: number, w = 420) => {
      ctx2d.fillStyle = "rgba(124,58,237,0.05)";
      ctx2d.beginPath();
      ctx2d.roundRect(x, y, w, 72, 12);
      ctx2d.fill();
      ctx2d.strokeStyle = "rgba(124,58,237,0.12)";
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.roundRect(x, y, w, 72, 12);
      ctx2d.stroke();

      ctx2d.font = "600 10px Georgia, serif";
      ctx2d.fillStyle = "#9ca3af";
      ctx2d.fillText(label.toUpperCase(), x + 16, y + 22);

      ctx2d.font = "bold 18px Georgia, serif";
      ctx2d.fillStyle = "#1e1b4b";
      const safeValue = String(value || "-");
      ctx2d.fillText(safeValue.length > 34 ? `${safeValue.slice(0, 31)}...` : safeValue, x + 16, y + 50);
    };

    const rows: [string, string][] = [
      ["Student Name", verificationSummary.name || "-"],
      ["Mobile", verificationSummary.mobile || "-"],
      ["Email", verificationSummary.email || "-"],
      ["Target Exam", verificationSummary.targetExam || "-"],
      ["Target Year", verificationSummary.targetYear || "-"],
      ["Course Enrolled", verificationSummary.courseEnrolled || "-"],
      ["Address", verificationSummary.address || "-"],
    ];

    const finish = (logoImg: HTMLImageElement | null) => {
      ctx2d.fillStyle = "rgba(124,58,237,0.1)";
      ctx2d.beginPath();
      ctx2d.arc(72, 62, 30, 0, Math.PI * 2);
      ctx2d.fill();

      if (logoImg) {
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.arc(72, 62, 27, 0, Math.PI * 2);
        ctx2d.clip();
        ctx2d.drawImage(logoImg, 45, 35, 54, 54);
        ctx2d.restore();
      }

      ctx2d.font = "bold 22px Georgia, serif";
      ctx2d.fillStyle = "#1e1b4b";
      ctx2d.fillText("ACME", 115, 56);
      ctx2d.font = "600 11px Georgia, serif";
      ctx2d.fillStyle = "#7c3aed";
      ctx2d.fillText("ACADEMY", 115, 74);
      ctx2d.font = "500 10px Georgia, serif";
      ctx2d.fillStyle = "#9ca3af";
      ctx2d.fillText("acmeacademy.in", 115, 90);

      ctx2d.strokeStyle = "rgba(124,58,237,0.12)";
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(52, 110);
      ctx2d.lineTo(948, 110);
      ctx2d.stroke();

      ctx2d.fillStyle = "rgba(124,58,237,0.1)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 124, 220, 28, 6);
      ctx2d.fill();
      ctx2d.strokeStyle = "rgba(124,58,237,0.25)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 124, 220, 28, 6);
      ctx2d.stroke();
      ctx2d.font = "bold 11px Georgia, serif";
      ctx2d.fillStyle = "#7c3aed";
      ctx2d.fillText("USER VERIFICATION PROFILE", 66, 143);

      drawLabelValue(rows[0][0], rows[0][1], 52, 172, 430);
      drawLabelValue(rows[1][0], rows[1][1], 514, 172, 434);
      drawLabelValue(rows[2][0], rows[2][1], 52, 260, 430);
      drawLabelValue(rows[3][0], rows[3][1], 514, 260, 434);
      drawLabelValue(rows[4][0], rows[4][1], 52, 348, 280);
      drawLabelValue(rows[5][0], rows[5][1], 350, 348, 180);
      drawLabelValue(rows[6][0], rows[6][1], 548, 348, 400);

      ctx2d.fillStyle = "rgba(16,185,129,0.08)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 532, 896, 56, 12);
      ctx2d.fill();
      ctx2d.strokeStyle = "rgba(16,185,129,0.24)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 532, 896, 56, 12);
      ctx2d.stroke();

      const acceptedBy = verificationSummary.name || verificationSummary.username || "Student";

      ctx2d.font = "600 12px Georgia, serif";
      ctx2d.fillStyle = "#065f46";
      ctx2d.fillText(`I, ${acceptedBy}, confirm that I have accepted the Terms and Conditions for the above data.`, 72, 566);

      ctx2d.fillStyle = "rgba(124,58,237,0.05)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 602, 420, 90, 12);
      ctx2d.fill();
      ctx2d.strokeStyle = "rgba(124,58,237,0.2)";
      ctx2d.beginPath();
      ctx2d.roundRect(52, 602, 420, 90, 12);
      ctx2d.stroke();
      ctx2d.font = "600 10px Georgia, serif";
      ctx2d.fillStyle = "#9ca3af";
      ctx2d.fillText("STUDENT SIGNATURE", 70, 625);

      if (verificationSummary.signatureDataUrl) {
        const signImg = new window.Image();
        signImg.onload = () => {
          ctx2d.drawImage(signImg, 70, 632, 180, 42);
          ctx2d.font = "bold 12px Georgia, serif";
          ctx2d.fillStyle = "#1e1b4b";
          ctx2d.fillText(acceptedBy, 70, 686);
          const link = document.createElement("a");
          link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.92);
          link.click();
        };
        signImg.onerror = () => {
          ctx2d.font = "bold 12px Georgia, serif";
          ctx2d.fillStyle = "#1e1b4b";
          ctx2d.fillText(acceptedBy, 70, 686);
          const link = document.createElement("a");
          link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
          link.href = canvas.toDataURL("image/jpeg", 0.92);
          link.click();
        };
        signImg.src = verificationSummary.signatureDataUrl;
        return;
      }

      ctx2d.font = "bold 12px Georgia, serif";
      ctx2d.fillStyle = "#1e1b4b";
      ctx2d.fillText(acceptedBy, 70, 686);

      const link = document.createElement("a");
      link.download = `${verificationSummary.name || "user"}-verification-profile.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    };

    const logo = new window.Image();
    logo.onload = () => finish(logo);
    logo.onerror = () => finish(null);
    logo.src = "/logo.png";
  };

  if (userLoading && !user) return <div className="text-center py-20 text-gray-600">Loading profile...</div>;

  if (!user)
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 relative overflow-hidden text-center"
        >
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10"></div>
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 -z-10"></div>

          <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
            ?
          </div>

          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">Welcome to Dashboard</h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-md mx-auto">
            Please{" "}
            <a href="/login" className="text-purple-600 font-semibold hover:underline">
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
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="relative w-28 h-28 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full blur-xl opacity-30 z-0"></div>
            <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
              {editData.profilePic ? (
                // eslint-disable-next-line @next/next/no-img-element -- blob:/data: URLs from FileReader/URL.createObjectURL, next/image can't optimize these
                <img src={editData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-gray-100 w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500">
                  {editData.fullname
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}
            </div>
          </motion.div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">{editData.fullname}</h2>
              {isVerified && <CheckCircle2 className="h-6 w-6 text-blue-500" aria-label="Verified user" />}
            </div>
            <p className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
              <Mail className="h-4 w-4 mr-2 opacity-70" />
              {editData.email}
            </p>

            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              {isVerificationLocked ? (
                <span className="text-indigo-700 font-medium">Verification submitted. Student edits are locked.</span>
              ) : (
                <span className="text-amber-700 font-medium">Verification pending. Complete profile verification once.</span>
              )}
            </div>

            {isVerificationLocked ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <InfoItem icon={User} label="Mobile" value={verificationSummary.mobile} />
                <InfoItem icon={Target} label="Exam" value={verificationSummary.targetExam} />
                <InfoItem icon={BookOpen} label="Year" value={verificationSummary.targetYear} />
                <InfoItem icon={GraduationCap} label="Course" value={verificationSummary.courseEnrolled} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <InfoItem icon={Calendar} label="Born" value={editData.dob} />
                <InfoItem icon={User} label="Gender" value={editData.gender} />
                <InfoItem icon={Target} label="Exam" value={editData.targetExam} />
                <InfoItem icon={BookOpen} label="Year" value={editData.targetYear} />
                <InfoItem icon={User} label="Father" value={editData.fatherName} />
                <InfoItem icon={GraduationCap} label="College" value={editData.collegeName} />
                <InfoItem icon={Hash} label="App ID" value={editData.nimcetApplicationId} />
              </div>
            )}
          </div>

          <div className="mt-6 md:mt-0 flex flex-col gap-2">
            {!isVerificationLocked && (
              <button onClick={() => setIsEditing(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </button>
            )}

            {!isVerificationLocked ? (
              <button onClick={() => router.push("/profile")} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
                Complete Verification
              </button>
            ) : (
              <button onClick={handleDownloadProfile} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download User Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {status && <p className={`text-center mt-4 ${status.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{status}</p>}

      <AnimatePresence>
        {isEditing && !isVerificationLocked && (
          <motion.div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] overflow-y-auto relative p-8"
            >
              <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                <X className="h-5 w-5 cursor-pointer" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Edit Your Profile</h2>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col items-center lg:w-1/3">
                  <label className="relative cursor-pointer w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500 shadow-lg">
                    {editData.profilePic && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={editData.profilePic} alt="Avatar" className="w-full h-full object-cover" />
                    )}
                    <input type="file" name="profilePic" accept="image/*" onChange={handleChange} className="hidden" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center text-sm text-white transition">Upload</div>
                  </label>
                  <p className="text-gray-500 text-sm mt-2">Click to change profile photo</p>
                </div>

                <div className="flex-1 grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", name: "fullname", type: "text" },
                    { label: "Father Name", name: "fatherName", type: "text" },
                    { label: "College Name", name: "collegeName", type: "text" },
                    { label: "Target Exam", name: "targetExam", type: "text" },
                    { label: "Target Year", name: "targetYear", type: "number" },
                    { label: "NIMCET Application ID", name: "nimcetApplicationId", type: "text" },
                    { label: "Date of Birth", name: "dob", type: "date" },
                  ].map((f, i) => (
                    <div key={i}>
                      <label className="block text-gray-700 font-medium mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={editData[f.name] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Gender</label>
                    <select
                      name="gender"
                      value={editData.gender || ""}
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
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-5 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white">
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

const InfoItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value?: string }) => (
  <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
    <Icon className="h-4 w-4 text-gray-500 mr-2" />
    <span className="text-sm text-gray-700">{label}:</span>
    <span className="ml-auto text-sm font-semibold text-gray-800">{value || "-"}</span>
  </div>
);

export default UserProfileCard;
