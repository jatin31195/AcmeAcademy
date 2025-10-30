import * as userService from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
