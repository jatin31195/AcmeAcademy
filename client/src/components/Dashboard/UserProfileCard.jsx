import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { BASE_URL } from "../../config";
import { useUser } from "../../UserContext"; 

const API_BASE = `${BASE_URL}/api/users`;

const UserProfileCard = () => {
  const { user, loading: userLoading, fetchUser } = useUser(); 

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [status, setStatus] = useState("");

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

  if (userLoading)
    return (
      <div className="text-center py-20 text-gray-600">Loading profile...</div>
    );

  if (!user)
    return (
      <div className="text-center py-20 text-gray-600">
        No profile data available.
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
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              {editData.fullname}
            </h2>
            <p className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
              <Mail className="h-4 w-4 mr-2 opacity-70" />
              {editData.email}
            </p>

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
          </div>

          <div className="mt-6 md:mt-0">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
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
        {isEditing && (
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
