import User from "../models/User.js";

const normalizeMobile = (value) => String(value || "").replace(/\D/g, "").slice(-10);

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const sanitizeForAdmin = (user) => {
  const safe = user.toObject();
  delete safe.password;
  delete safe.__v;
  return safe;
};

/**
 * GET /api/admin/users
 * Fetch all users (admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "fullname username email phone targetExam targetYear verificationStatus verificationProfileLocked createdAt profilePic"
      )
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      id: u._id,
      _id: u._id,
      name: u.fullname || u.username,
      fullname: u.fullname || "",
      username: u.username || "",
      email: u.email,
      phone: u.phone || "",
      targetExam: u.targetExam || "",
      targetYear: u.targetYear || "",
      verificationStatus: u.verificationStatus || "pending",
      verificationProfileLocked: !!u.verificationProfileLocked,
      profilePic: u.profilePic || "",
      role: "Student", // future-proof (admin/instructor later)
      status: "Active", // you can wire this later
      joined: u.createdAt.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * GET /api/admin/users/:userId
 * Fetch a single user with complete profile (admin)
 */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "testAttempts",
      select: "score accuracy submittedAt totalTimeTaken",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeForAdmin(user),
    });
  } catch (err) {
    console.error("Get user by id error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

/**
 * PUT /api/admin/users/:userId
 * Update complete user details (admin only)
 */
export const updateUserByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const body = req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const normalizedPhone = body.phone !== undefined ? normalizeMobile(body.phone) : user.phone;
    const normalizedVerificationMobile =
      body.verificationMobile !== undefined
        ? normalizeMobile(body.verificationMobile)
        : normalizeMobile(user.verificationProfile?.mobile || normalizedPhone);

    if (body.email !== undefined && String(body.email).trim()) {
      const existingEmail = await User.findOne({
        _id: { $ne: user._id },
        email: String(body.email).trim().toLowerCase(),
      }).select("_id");
      if (existingEmail) {
        return res.status(409).json({ success: false, message: "Email already in use" });
      }
      user.email = String(body.email).trim().toLowerCase();
    }

    if (body.username !== undefined && String(body.username).trim()) {
      const existingUsername = await User.findOne({
        _id: { $ne: user._id },
        username: String(body.username).trim(),
      }).select("_id");
      if (existingUsername) {
        return res.status(409).json({ success: false, message: "Username already in use" });
      }
      user.username = String(body.username).trim();
    }

    if (normalizedPhone) {
      const existingPhone = await User.findOne({
        _id: { $ne: user._id },
        $or: [{ phone: normalizedPhone }, { "verificationProfile.mobile": normalizedPhone }],
      }).select("_id");
      if (existingPhone) {
        return res.status(409).json({ success: false, message: "Phone already in use" });
      }
      user.phone = normalizedPhone;
    }

    if (normalizedVerificationMobile) {
      const existingVerificationMobile = await User.findOne({
        _id: { $ne: user._id },
        $or: [
          { phone: normalizedVerificationMobile },
          { "verificationProfile.mobile": normalizedVerificationMobile },
        ],
      }).select("_id");
      if (existingVerificationMobile) {
        return res
          .status(409)
          .json({ success: false, message: "Verification mobile already in use" });
      }
    }

    if (body.fullname !== undefined) user.fullname = String(body.fullname || "").trim();
    if (body.whatsapp !== undefined) user.whatsapp = String(body.whatsapp || "").trim();
    if (body.gender !== undefined) user.gender = body.gender || null;
    if (body.fatherName !== undefined) user.fatherName = String(body.fatherName || "").trim();
    if (body.collegeName !== undefined) user.collegeName = String(body.collegeName || "").trim();
    if (body.nimcetApplicationId !== undefined)
      user.nimcetApplicationId = String(body.nimcetApplicationId || "").trim();
    if (body.targetExam !== undefined) user.targetExam = String(body.targetExam || "").trim();

    if (body.targetYear !== undefined) {
      user.targetYear = toNumberOrNull(body.targetYear);
    }

    if (body.dob !== undefined) {
      const parsedDob = body.dob ? new Date(body.dob) : null;
      if (parsedDob && !Number.isNaN(parsedDob.getTime())) {
        user.dob = parsedDob;
      }
    }

    if (body.verificationStatus !== undefined) {
      user.verificationStatus = String(body.verificationStatus || "pending").trim();
    }

    if (body.verificationProfileLocked !== undefined) {
      user.verificationProfileLocked = toBoolean(
        body.verificationProfileLocked,
        user.verificationProfileLocked
      );
    }

    if (body.verificationProfileSubmitted !== undefined) {
      user.verificationProfileSubmitted = toBoolean(
        body.verificationProfileSubmitted,
        user.verificationProfileSubmitted
      );
    }

    const existingVerificationProfile = user.verificationProfile || {};
    user.verificationProfile = {
      ...existingVerificationProfile,
      mobile: normalizedVerificationMobile || existingVerificationProfile.mobile || user.phone || "",
      address:
        body.address !== undefined
          ? String(body.address || "").trim()
          : existingVerificationProfile.address || "",
      targetExam:
        body.verificationTargetExam !== undefined
          ? String(body.verificationTargetExam || "").trim()
          : existingVerificationProfile.targetExam || user.targetExam || "",
      targetYear:
        body.verificationTargetYear !== undefined
          ? toNumberOrNull(body.verificationTargetYear)
          : existingVerificationProfile.targetYear,
      courseEnrolled:
        body.courseEnrolled !== undefined
          ? String(body.courseEnrolled || "").trim()
          : existingVerificationProfile.courseEnrolled || "",
      batchesEnrolled:
        body.batchesEnrolled !== undefined
          ? String(body.batchesEnrolled || "").trim()
          : existingVerificationProfile.batchesEnrolled || "",
      fatherName:
        body.vpFatherName !== undefined
          ? String(body.vpFatherName || "").trim()
          : existingVerificationProfile.fatherName || "",
      motherName:
        body.vpMotherName !== undefined
          ? String(body.vpMotherName || "").trim()
          : existingVerificationProfile.motherName || "",
      parentsContact:
        body.parentsContact !== undefined
          ? String(body.parentsContact || "").trim()
          : existingVerificationProfile.parentsContact || "",
      city:
        body.city !== undefined
          ? String(body.city || "").trim()
          : existingVerificationProfile.city || "",
      state:
        body.state !== undefined
          ? String(body.state || "").trim()
          : existingVerificationProfile.state || "",
      idType:
        body.idType !== undefined
          ? String(body.idType || "").trim()
          : existingVerificationProfile.idType || "",
      termsAccepted:
        body.termsAccepted !== undefined
          ? toBoolean(body.termsAccepted, existingVerificationProfile.termsAccepted)
          : existingVerificationProfile.termsAccepted,
    };

    user.activityLogs = Array.isArray(user.activityLogs) ? user.activityLogs : [];
    user.activityLogs.push({
      action: "ADMIN_PROFILE_EDIT",
      message: "Profile details updated by admin",
      meta: {
        adminId: req.admin?._id || null,
      },
      at: new Date(),
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: sanitizeForAdmin(user),
    });
  } catch (err) {
    console.error("Admin update user error:", err);
    return res.status(500).json({ success: false, message: "Failed to update user" });
  }
};
