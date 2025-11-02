import * as userService from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
export const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password, dob, phone, whatsapp } = req.body;

    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    const existingPhone = await userService.getUserByPhone(phone);
    if (existingPhone)
      return res.status(400).json({ message: "Phone number already registered" });

    const user = await userService.createUser({
      username,
      fullname,
      email,
      password,
      dob,
      phone,
      whatsapp,
    });

    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser({
      email,
      password,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, 
      })
      .status(200)
      .json({
        message: "Login successful",
        userId: user._id,
        username: user.username,
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(400).json({ message: err.message || "Login failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken)
      return res.status(401).json({ message: "No access token" });

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("Get user error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Logout failed" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId; 
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = [
      "fullname",
      "dob",
      "gender",
      "fatherName",
      "collegeName",
      "nimcetApplicationId",
      "targetExam",
      "targetYear",
      "whatsapp",
      "phone",
    ];

    if (req.file) {
      user.profilePic = `/uploads/${req.file.filename}`;
    }

  
    for (const field of fields) {
      if (req.body[field] !== undefined && req.body[field] !== "")
        user[field] = req.body[field];
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const user = await User.findById(userId)
      .select("-password -__v")
      .populate("testAttempts"); 

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
export const getUserTestAttempts = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const attempts = await UserTestAttempt.find({ user: userId })
      .populate({
        path: "test",
        select: "title subject totalMarks duration",
      })
      .sort({ submittedAt: -1 });

    if (!attempts || attempts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No test attempts found",
        attempts: [],
      });
    }

    const formattedAttempts = attempts.map((attempt) => ({
      _id: attempt._id,
      testId: attempt.test?._id,
      testTitle: attempt.test?.title || "Unknown Test",
      subject: attempt.test?.subject || "General",
      totalMarks: attempt.test?.totalMarks || 0,
      duration: attempt.test?.duration || 0,
      score: attempt.score,
      rank: attempt.rank,
      totalTimeTaken: attempt.totalTimeTaken,
      attemptNumber: attempt.attemptNumber,
      isSubmitted: attempt.isSubmitted,
      submittedAt: attempt.submittedAt,
    }));

    res.status(200).json({
      success: true,
      totalAttempts: formattedAttempts.length,
      attempts: formattedAttempts,
    });
  } catch (err) {
    console.error("Error fetching user test attempts:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching test attempts",
    });
  }
};