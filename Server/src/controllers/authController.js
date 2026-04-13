// OTP verification using 2Factor API (direct phone/otp, not session-based)
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "phone and otp are required" });
    }

    if (!process.env.TWO_FACTOR_API_KEY) {
      return res.status(500).json({ message: "2Factor is not configured" });
    }

    const normalizedPhone = getPhoneFromIndianInput(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Valid 10-digit phone is required" });
    }

    // Call 2Factor API for OTP verification
    const url = `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY3/${normalizedPhone}/${String(otp).trim()}`;
    const response = await axios.get(url);

    if (response?.data?.Status !== "Success") {
      return res.status(400).json({ message: response?.data?.Details || "OTP verification failed" });
    }

    return res.status(200).json({
      verified: true,
      message: "OTP verified successfully",
      details: response.data,
    });
  } catch (err) {
    console.error("2Factor OTP verify error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Server error verifying OTP" });
  }
};
import * as userService from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
import { uploadToCloudinary } from "../utils/multerCloudinary.js";
import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
const otpSessionStore = new Map();
const verifiedOtpTokenStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;
const VERIFIED_TOKEN_TTL_MS = 15 * 60 * 1000;
const TWO_FACTOR_TEMPLATE = process.env.TWO_FACTOR_TEMPLATE || "OTP1";

const toNumberOrNull = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeMobile = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length ? digits : "";
};

const getPhoneFromIndianInput = (value) => {
  const digits = normalizeMobile(value);
  if (!digits) return "";

  const tenDigits = digits.slice(-10);
  if (tenDigits.length !== 10) return "";
  return tenDigits;
};

const cleanupExpiredOtpState = () => {
  const now = Date.now();

  for (const [sessionId, item] of otpSessionStore.entries()) {
    if (now - item.createdAt > OTP_TTL_MS) {
      otpSessionStore.delete(sessionId);
    }
  }

  for (const [token, item] of verifiedOtpTokenStore.entries()) {
    if (now - item.createdAt > VERIFIED_TOKEN_TTL_MS) {
      verifiedOtpTokenStore.delete(token);
    }
  }
};

const buildVerificationSummary = (userDoc) => {
  const p = userDoc.verificationProfile || {};
  const acceptedBy = userDoc.fullname || "Student";
  return {
    name: userDoc.fullname || "",
    mobile: userDoc.phone || p.mobile || userDoc.whatsapp || "",
    email: userDoc.email || "",
    address: p.address || "",
    targetExam: userDoc.targetExam || p.targetExam || "",
    targetYear: userDoc.targetYear || p.targetYear || "",
    courseEnrolled: p.courseEnrolled || "",
    termsAccepted: !!p.termsAccepted,
    acceptedBy,
    acceptedDeclaration: `I, ${acceptedBy}, confirm that I have accepted the Terms and Conditions for the above data.`,
    submittedAt: userDoc.verificationSubmittedAt || null,
    signatureDataUrl: p.signatureDataUrl || "",
    downloadProfileCardDataUrl: p.downloadProfileCardDataUrl || "",
    verificationMedia: {
      profilePic: userDoc.profilePic || "",
      idFrontUrl: p.idFrontUrl || "",
      idBackUrl: p.idBackUrl || "",
      marksheetUrl: p.marksheetUrl || "",
      latestPhotoUrl: p.latestPhotoUrl || "",
      passportPhotoUrl: p.passportPhotoUrl || "",
      livePhotoDataUrl: p.livePhotoDataUrl || "",
      signatureDataUrl: p.signatureDataUrl || "",
      downloadProfileCardDataUrl: p.downloadProfileCardDataUrl || "",
      applicationForms: Array.isArray(p.applicationForms)
        ? p.applicationForms.map((form, index) => ({
            exam: form?.exam || "",
            fileUrl: form?.fileUrl || "",
            id: form?._id || index,
          }))
        : [],
    },
  };
};

const sanitizeUserForStudent = (userDoc) => {
  const safeUser = userDoc.toObject();
  delete safeUser.password;
  delete safeUser.__v;
  delete safeUser.verificationProfile;
  safeUser.verificationSummary = buildVerificationSummary(userDoc);
  return safeUser;
};
export const sendEmailOtp = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { phone, purpose = "signup" } = req.body;

    const normalizedPurpose = String(purpose || "signup").toLowerCase();
    if (!["signup", "login"].includes(normalizedPurpose)) {
      return res.status(400).json({ message: "Invalid purpose. Use signup or login." });
    }

    const normalizedPhone = getPhoneFromIndianInput(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Valid 10-digit phone is required" });
    }

    const existingByPhone = await userService.getUserByPhone(normalizedPhone);
    if (normalizedPurpose === "signup" && existingByPhone) {
      return res.status(400).json({ message: "Phone already registered" });
    }
    if (normalizedPurpose === "login" && !existingByPhone) {
      return res.status(404).json({ message: "User not found with this phone" });
    }

    if (!process.env.TWO_FACTOR_API_KEY) {
      return res.status(500).json({ message: "2Factor is not configured" });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/91${normalizedPhone}/AUTOGEN1/${encodeURIComponent(
        TWO_FACTOR_TEMPLATE
      )}`
    );

    if (response?.data?.Status !== "Success" || !response?.data?.Details) {
      return res.status(502).json({
        message: response?.data?.Details || "Failed to send SMS OTP",
      });
    }

    const sessionId = String(response.data.Details);
    otpSessionStore.set(sessionId, {
      phone: normalizedPhone,
      purpose: normalizedPurpose,
      createdAt: Date.now(),
    });

    return res.status(200).json({
      message: "OTP sent successfully",
      sessionId,
      phone: normalizedPhone,
      purpose: normalizedPurpose,
    });
  } catch (err) {
    console.error("Send OTP error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const sendPasswordResetOtp = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { email } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userService.getUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const normalizedPhone = getPhoneFromIndianInput(user.phone || user.whatsapp);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "No valid phone number found for this account" });
    }

    if (!process.env.TWO_FACTOR_API_KEY) {
      return res.status(500).json({ message: "2Factor is not configured" });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/91${normalizedPhone}/AUTOGEN1/${encodeURIComponent(
        TWO_FACTOR_TEMPLATE
      )}`
    );

    if (response?.data?.Status !== "Success" || !response?.data?.Details) {
      return res.status(502).json({
        message: response?.data?.Details || "Failed to send reset OTP",
      });
    }

    const sessionId = String(response.data.Details);
    otpSessionStore.set(sessionId, {
      phone: normalizedPhone,
      purpose: "reset-password",
      userId: String(user._id),
      email: normalizedEmail,
      createdAt: Date.now(),
    });

    return res.status(200).json({
      message: "Reset OTP sent successfully",
      sessionId,
      maskedPhone: normalizedPhone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2"),
    });
  } catch (err) {
    console.error("Send reset OTP error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

export const verifyPasswordResetOtp = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { sessionId, otp } = req.body;

    if (!sessionId || !otp) {
      return res.status(400).json({ message: "sessionId and otp are required" });
    }

    const storedSession = otpSessionStore.get(String(sessionId));
    if (!storedSession || storedSession.purpose !== "reset-password") {
      return res.status(400).json({ message: "OTP session not found or expired" });
    }

    if (!process.env.TWO_FACTOR_API_KEY) {
      return res.status(500).json({ message: "2Factor is not configured" });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${String(
        otp
      ).trim()}`
    );

    const otpMatched =
      response?.data?.Details === "OTP Matched" || response?.data?.Status === "Success";

    if (!otpMatched) {
      return res.status(400).json({ message: response?.data?.Details || "Invalid OTP" });
    }

    const resetToken = crypto.randomBytes(24).toString("hex");
    verifiedOtpTokenStore.set(resetToken, {
      phone: storedSession.phone,
      purpose: "reset-password",
      userId: storedSession.userId,
      email: storedSession.email,
      createdAt: Date.now(),
    });

    otpSessionStore.delete(String(sessionId));

    return res.status(200).json({
      verified: true,
      message: "Reset OTP verified successfully",
      resetToken,
      maskedPhone: storedSession.phone.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2"),
    });
  } catch (err) {
    console.error("Verify reset OTP error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Server error verifying reset OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword || !String(newPassword).trim()) {
      return res.status(400).json({ message: "resetToken and newPassword are required" });
    }

    const verifiedTokenEntry = verifiedOtpTokenStore.get(resetToken);
    if (!verifiedTokenEntry || verifiedTokenEntry.purpose !== "reset-password") {
      return res.status(403).json({ message: "Reset OTP is missing or expired" });
    }

    const updatedUser = await userService.updateUserPassword(
      verifiedTokenEntry.userId,
      String(newPassword).trim()
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    verifiedOtpTokenStore.delete(resetToken);

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err.message || err);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

export const verifyEmailOtp = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { sessionId, otp, phone } = req.body;

    if (!sessionId || !otp || !phone) {
      return res.status(400).json({ message: "sessionId, otp and phone are required" });
    }

    const normalizedPhone = getPhoneFromIndianInput(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Valid 10-digit phone is required" });
    }

    const storedSession = otpSessionStore.get(String(sessionId));
    if (!storedSession) {
      return res.status(400).json({ message: "OTP session not found or expired" });
    }

    if (storedSession.phone !== normalizedPhone) {
      return res.status(400).json({ message: "Phone does not match OTP session" });
    }

    if (Date.now() - storedSession.createdAt > OTP_TTL_MS) {
      otpSessionStore.delete(String(sessionId));
      return res.status(400).json({ message: "OTP expired" });
    }

    if (!process.env.TWO_FACTOR_API_KEY) {
      return res.status(500).json({ message: "2Factor is not configured" });
    }

    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${String(
        otp
      ).trim()}`
    );

    const otpMatched =
      response?.data?.Details === "OTP Matched" || response?.data?.Status === "Success";

    if (!otpMatched) {
      return res.status(400).json({ message: response?.data?.Details || "Invalid OTP" });
    }

    const verificationToken = crypto.randomBytes(24).toString("hex");
    verifiedOtpTokenStore.set(verificationToken, {
      phone: storedSession.phone,
      purpose: storedSession.purpose,
      createdAt: Date.now(),
    });

    otpSessionStore.delete(String(sessionId));

    return res.status(200).json({
      verified: true,
      message: "OTP verified successfully",
      verificationToken,
      phone: storedSession.phone,
      purpose: storedSession.purpose,
    });
  } catch (err) {
    console.error("Verify OTP error:", err?.response?.data || err.message || err);
    return res.status(500).json({ message: "Server error verifying OTP" });
  }
};

export const registerUser = async (req, res) => {
  try {
    cleanupExpiredOtpState();
    const { fullname, name, email, password, phone, targetYear, otpToken } = req.body;
    const resolvedFullname = String(fullname || name || "").trim();
    const parsedTargetYear = targetYear === undefined || targetYear === "" ? null : toNumberOrNull(targetYear);

    if (!resolvedFullname) {
      return res.status(400).json({ message: "Name is required for signup" });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Email is required for signup" });
    }

    if (!password || !String(password).trim()) {
      return res.status(400).json({ message: "Password is required for signup" });
    }

    if (targetYear !== undefined && targetYear !== "" && !parsedTargetYear) {
      return res.status(400).json({ message: "Invalid targetYear" });
    }

    const normalizedPhone = getPhoneFromIndianInput(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: "Valid 10-digit phone is required" });
    }

    const verifiedOtpEntry = verifiedOtpTokenStore.get(otpToken);
    if (!verifiedOtpEntry || verifiedOtpEntry.purpose !== "signup") {
      return res.status(403).json({ message: "Please verify signup OTP before registration" });
    }
    if (verifiedOtpEntry.phone !== normalizedPhone) {
      return res.status(403).json({ message: "OTP does not belong to this phone" });
    }

    verifiedOtpTokenStore.delete(otpToken);

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingEmail = await userService.getUserByEmail(normalizedEmail);
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    const existingPhone = await userService.getUserByPhone(normalizedPhone);
    if (existingPhone)
      return res.status(400).json({ message: "Phone already registered" });

    // ✅ Create user
    const user = await userService.createUser({
      fullname: resolvedFullname,
      email: normalizedEmail,
      password: String(password).trim(),
      phone: normalizedPhone,
      targetYear: parsedTargetYear,
    });

    let welcomeEmailSent = false;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailHTML = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fc; padding: 30px; border-radius: 12px; max-width: 600px; margin: 20px auto; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border: 1px solid #e0e0e0;">
        
        <div style="text-align:center; margin-bottom: 20px;">
          <img src="https://res.cloudinary.com/dwqvrtvu1/image/upload/v1762162237/logo_1_yo58k3.png" alt="ACME Academy Logo" style="width: 130px; border-radius: 8px;" />
        </div>

        <h2 style="color:#1e40af; text-align:center;">🎉 Welcome to ACME Academy!</h2>

        <p style="font-size:16px; color:#333; text-align:center; margin: 15px 0;">
          Dear <strong>${resolvedFullname || "Student"}</strong>,
        </p>

        <p style="font-size:15px; line-height:1.6; color:#444;">
          Congratulations on taking your first step toward MCA Entrance success! 🚀
        </p>

        <p style="font-size:15px; line-height:1.6; color:#444;">
          We're thrilled to have you join the <strong>ACME Academy</strong> family. Our mission is to help you excel in all your MCA entrance exams like 
          <strong>NIMCET</strong>, <strong>CUET</strong>, <strong>VIT</strong>, and <strong>MAH-CET</strong>.
        </p>

        <p style="font-size:15px; line-height:1.6; color:#444;">
          Keep practicing, stay consistent, and never stop believing in yourself. Remember — success is a journey, not a destination.
        </p>

        <div style="text-align:center; margin: 25px 0;">
          <a href="https://acmeacademy.in" 
             style="background:#1e40af; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold; display:inline-block;">
             Start Your Journey →
          </a>
        </div>

        <p style="font-size:14px; color:#555; text-align:center;">
          Wishing you all the very best for your MCA entrance journey!<br/>
          <strong>- Team ACME Academy 💙</strong>
        </p>

        <hr style="margin:25px 0; border:0; border-top:1px solid #ddd;" />

        <p style="text-align:center; font-size:13px; color:#777;">
          © ${new Date().getFullYear()} ACME Academy. All Rights Reserved.<br/>
          <span style="font-size:12px;">This is an automated welcome email. Please do not reply.</span>
        </p>
      </div>
      `;

      const mailOptions = {
        from: `"ACME Academy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🎉 Welcome to ACME Academy — Let’s Begin Your MCA Journey!",
        html: mailHTML,
      };

      try {
        await transporter.sendMail(mailOptions);
        welcomeEmailSent = true;
      } catch (mailErr) {
        console.error("Welcome email send failed:", mailErr);
      }
    }

    res.status(201).json({
      message: welcomeEmailSent
        ? "User created successfully and welcome email sent!"
        : "User created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);

    if (err?.code === 11000) {
      const duplicateField = Object.keys(err?.keyValue || {})[0];
      const duplicateValue = duplicateField ? err.keyValue[duplicateField] : "";
      const fieldLabel =
        duplicateField === "email"
            ? "Email"
            : duplicateField === "phone"
              ? "Phone"
              : "Field";

      return res.status(400).json({
        message: `${fieldLabel} already registered${duplicateValue ? `: ${duplicateValue}` : ""}`,
      });
    }

    res.status(500).json({ message: err?.message || "Server Error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    cleanupExpiredOtpState();

    const { email, password, phone, otpToken } = req.body;
    let user;
    let accessToken;
    let refreshToken;

    if (phone && otpToken) {
      const normalizedPhone = getPhoneFromIndianInput(phone);
      if (!normalizedPhone) {
        return res.status(400).json({ message: "Valid 10-digit phone is required" });
      }

      const verifiedOtpEntry = verifiedOtpTokenStore.get(otpToken);
      if (!verifiedOtpEntry || verifiedOtpEntry.purpose !== "login") {
        return res.status(403).json({ message: "Please verify login OTP before continuing" });
      }

      if (verifiedOtpEntry.phone !== normalizedPhone) {
        return res.status(403).json({ message: "OTP does not belong to this phone" });
      }

      verifiedOtpTokenStore.delete(otpToken);

      const authResult = await userService.loginUserByPhone(normalizedPhone);
      user = authResult.user;
      accessToken = authResult.accessToken;
      refreshToken = authResult.refreshToken;
    } else {
      const authResult = await userService.loginUser({
        email,
        password,
      });
      user = authResult.user;
      accessToken = authResult.accessToken;
      refreshToken = authResult.refreshToken;
    }

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
        fullname: user.fullname,
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
    res.status(200).json({ user: sanitizeUserForStudent(user) });
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

    res.status(200).json({ success: true, user: sanitizeUserForStudent(user) });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.status(401).json({ message: "Refresh token invalid or expired" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", 
    };

    
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
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

    return res.status(403).json({
      success: false,
      message:
        "Profile edits are restricted. Only admin can update user details now.",
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const submitVerificationProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verificationProfileLocked || user.verificationProfileSubmitted) {
      return res.status(409).json({
        success: false,
        message:
          "Verification profile already submitted. Only admin can edit it now.",
      });
    }

    const {
      mobile,
      address,
      targetExam,
      targetExams,
      targetYear,
      courseEnrolled,
      batchesEnrolled,
      fatherName,
      motherName,
      parentsContact,
      city,
      state,
      idType,
      livePhotoDataUrl,
      signatureDataUrl,
      profileCardImageDataUrl,
      profileCardAcceptedAt,
      termsAccepted,
    } = req.body;

    const acceptedAt = profileCardAcceptedAt ? new Date(profileCardAcceptedAt) : new Date();
    const acceptedAtSafe = Number.isNaN(acceptedAt.getTime()) ? new Date() : acceptedAt;

    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedMobile || !address || !targetExam || !targetYear || !courseEnrolled) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: mobile, address, targetExam, targetYear, courseEnrolled.",
      });
    }

    const mobileHolder = await User.findOne({
      _id: { $ne: user._id },
      $or: [{ phone: normalizedMobile }, { "verificationProfile.mobile": normalizedMobile }],
    }).select("_id");

    if (mobileHolder) {
      return res.status(409).json({
        success: false,
        message: "This mobile number is already linked to another verified profile.",
      });
    }

    if (termsAccepted !== "true") {
      return res.status(400).json({
        success: false,
        message: "Please accept terms before submission.",
      });
    }

    const filesArray = Array.isArray(req.files) ? req.files : [];
    const allowedFixedFileFields = new Set([
      "idFront",
      "idBack",
      "marksheet",
      "latestPhoto",
      "photo",
      "passportPhoto",
    ]);

    for (const f of filesArray) {
      const isDynamicApplication = /^applicationForm_/i.test(f.fieldname || "");
      if (!allowedFixedFileFields.has(f.fieldname) && !isDynamicApplication) {
        return res.status(400).json({
          success: false,
          message: `Unexpected upload field: ${f.fieldname}`,
        });
      }
    }

    const getOne = (key) => filesArray.find((f) => f.fieldname === key) || null;

    const idFrontFile = getOne("idFront");
    const idBackFile = getOne("idBack");

    if (!idFrontFile || !idBackFile) {
      return res.status(400).json({
        success: false,
        message: "ID front and ID back files are required.",
      });
    }

    const cloudFolder = `users/${user._id}/verification`;

    const [
      idFrontUrl,
      idBackUrl,
      marksheetUrl,
      latestPhotoUrl,
      passportPhotoUrl,
    ] = await Promise.all([
      uploadToCloudinary(idFrontFile.path, cloudFolder, "auto"),
      uploadToCloudinary(idBackFile.path, cloudFolder, "auto"),
      getOne("marksheet")
        ? uploadToCloudinary(getOne("marksheet").path, cloudFolder, "auto")
        : Promise.resolve(""),
      getOne("latestPhoto") || getOne("photo")
        ? uploadToCloudinary(
            (getOne("latestPhoto") || getOne("photo")).path,
            cloudFolder,
            "auto"
          )
        : Promise.resolve(""),
      getOne("passportPhoto")
        ? uploadToCloudinary(getOne("passportPhoto").path, cloudFolder, "auto")
        : Promise.resolve(""),
    ]);

    let parsedTargetExams = [];
    if (targetExams) {
      try {
        const maybeArray = JSON.parse(targetExams);
        if (Array.isArray(maybeArray)) {
          parsedTargetExams = maybeArray.map((v) => String(v).trim()).filter(Boolean);
        }
      } catch {
        parsedTargetExams = String(targetExams)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }

    if (!parsedTargetExams.length && targetExam) {
      parsedTargetExams = [String(targetExam).trim()];
    }

    const applicationFormFiles = filesArray.filter((f) =>
      /^applicationForm_/i.test(f.fieldname || "")
    );

    const applicationForms = await Promise.all(
      applicationFormFiles.map(async (f) => {
        const exam = String(f.fieldname).replace(/^applicationForm_/i, "").trim();
        const fileUrl = await uploadToCloudinary(f.path, cloudFolder, "auto");
        return { exam, fileUrl };
      })
    );

    const parsedTargetYear = toNumberOrNull(targetYear);
    if (!parsedTargetYear) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid targetYear" });
    }

    user.verificationProfile = {
      mobile: normalizedMobile,
      address: String(address).trim(),
      targetExam: String(targetExam || parsedTargetExams[0] || "").trim(),
      targetExams: parsedTargetExams,
      targetYear: parsedTargetYear,
      courseEnrolled: String(courseEnrolled || batchesEnrolled || "").trim(),
      batchesEnrolled: String(batchesEnrolled || courseEnrolled || "").trim(),
      fatherName: fatherName ? String(fatherName).trim() : "",
      motherName: motherName ? String(motherName).trim() : "",
      parentsContact: parentsContact ? String(parentsContact).trim() : "",
      city: city ? String(city).trim() : "",
      state: state ? String(state).trim() : "",
      idType: idType ? String(idType).trim() : "",
      idFrontUrl,
      idBackUrl,
      marksheetUrl,
      latestPhotoUrl,
      passportPhotoUrl,
      applicationForms,
      livePhotoDataUrl: livePhotoDataUrl || "",
      signatureDataUrl: signatureDataUrl || "",
      termsAccepted: true,
      termsAcceptedAt: acceptedAtSafe,
      downloadProfileCardDataUrl: profileCardImageDataUrl || "",
    };

    user.phone = normalizedMobile;
    user.targetExam = String(targetExam || parsedTargetExams[0] || "").trim();
    user.targetYear = parsedTargetYear;
    user.verificationProfileSubmitted = true;
    user.verificationProfileLocked = true;
    user.verificationSubmittedAt = new Date();
    user.verificationStatus = "pending";
    user.activityLogs = Array.isArray(user.activityLogs) ? user.activityLogs : [];
    user.activityLogs.push({
      action: "VERIFICATION_TERMS_ACCEPTED",
      message: "Student accepted terms and submitted verification profile.",
      meta: {
        acceptedBy: user.fullname || "Student",
        mobile: normalizedMobile,
        acceptedAt: acceptedAtSafe,
      },
      at: acceptedAtSafe,
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Verification profile submitted successfully. It is now locked for student edits.",
      user: sanitizeUserForStudent(user),
    });
  } catch (err) {
    console.error("Verification profile submit error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to submit verification profile" });
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
        user: sanitizeUserForStudent(user),
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const adminUpdateVerificationProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const body = req.body || {};
    const current = user.verificationProfile || {};

    const nextTargetYear =
      body.targetYear !== undefined ? toNumberOrNull(body.targetYear) : current.targetYear;

    const nextMobile =
      body.mobile !== undefined
        ? normalizeMobile(body.mobile)
        : normalizeMobile(current.mobile || user.phone || "");

    if (nextMobile) {
      const mobileHolder = await User.findOne({
        _id: { $ne: user._id },
        $or: [{ phone: nextMobile }, { "verificationProfile.mobile": nextMobile }],
      }).select("_id");

      if (mobileHolder) {
        return res.status(409).json({
          success: false,
          message: "This mobile number is already linked to another user.",
        });
      }
    }

    user.verificationProfile = {
      ...current,
      mobile: nextMobile,
      address: body.address ?? current.address,
      targetExam: body.targetExam ?? current.targetExam,
      targetYear: nextTargetYear,
      courseEnrolled: body.courseEnrolled ?? current.courseEnrolled,
      fatherName: body.fatherName ?? current.fatherName,
      motherName: body.motherName ?? current.motherName,
      parentsContact: body.parentsContact ?? current.parentsContact,
      city: body.city ?? current.city,
      state: body.state ?? current.state,
      idType: body.idType ?? current.idType,
      termsAccepted:
        body.termsAccepted !== undefined ? !!body.termsAccepted : current.termsAccepted,
    };

    if (body.mobile !== undefined) user.phone = nextMobile;
    if (body.targetExam !== undefined) user.targetExam = String(body.targetExam);
    if (body.targetYear !== undefined && nextTargetYear) user.targetYear = nextTargetYear;
    if (body.verificationStatus) user.verificationStatus = body.verificationStatus;

    user.verificationProfileSubmitted = true;
    user.verificationProfileLocked = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Verification profile updated by admin",
      user: sanitizeUserForStudent(user),
    });
  } catch (err) {
    console.error("Admin verification update error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update verification profile",
    });
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
        select:
          "title subject totalMarks duration sections questions totalQuestions totalDurationMinutes",
      })
      .sort({ submittedAt: -1 });

    if (!attempts || attempts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No test attempts found",
        attempts: [],
      });
    }

    const formattedAttempts = attempts.map((attempt) => {
      const test = attempt.test;
      if (!test) {
        return {
          _id: attempt._id,
          testId: null,
          testTitle: "Unknown Test",
          subject: "General",
          totalMarks: 0,
          duration: 0,
          score: 0,
          accuracy: 0,
          totalTimeTaken: 0,
          attemptNumber: attempt.attemptNumber,
          isSubmitted: attempt.isSubmitted,
          submittedAt: attempt.submittedAt,
          rank: attempt.rank ?? null,
        };
      }

      let correct = 0;
      let incorrect = 0;
      let unattempted = 0;
      let totalScore = 0;
      let positiveMarks = 0;
      let negativeMarks = 0;


      (test.questions || []).forEach((question) => {
        const qidStr = question._id.toString();

        const userAnsObj = attempt.answers?.find(
          (a) => a.question && a.question.toString() === qidStr
        );

        const sectionId = question.section ? question.section.toString() : null;
        const section =
          test.sections?.find((s) => s._id && s._id.toString() === sectionId) ||
          null;

        const marksForQuestion = section?.marksPerQuestion ?? 1;
        const negMarks = section?.negativeMarks ?? 0;

        const correctAnswer = question.correctAnswer
          ? question.correctAnswer.toString().trim()
          : null;

        const userAnswerRaw = userAnsObj?.answer ?? null;
        const userAnswer =
          userAnswerRaw === null || userAnswerRaw === undefined
            ? null
            : userAnswerRaw.toString().trim();

        let result = "unattempted";
        if (userAnswer) {
          result =
            correctAnswer !== null && userAnswer === correctAnswer
              ? "correct"
              : "wrong";
        }

        let marksObtained = 0;
        if (result === "correct") {
          marksObtained = marksForQuestion;
          correct++;
          positiveMarks += marksObtained;
        } else if (result === "wrong") {
          marksObtained = -negMarks;
          incorrect++;
          negativeMarks += Math.abs(marksObtained);
        } else {
          unattempted++;
        }

        totalScore += marksObtained;
      });

      const attempted = correct + incorrect;
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

      const maxMarks =
        test.sections?.length > 0
          ? test.sections.reduce(
              (acc, s) =>
                acc + (s.numQuestions || 0) * (s.marksPerQuestion ?? 1),
              0
            )
          : test.totalMarks ?? 0;

      const totalTimeTaken =
        attempt.totalTimeTaken ||
        attempt.answers.reduce((acc, a) => acc + (a.timeTaken || 0), 0);

      return {
        _id: attempt._id,
        testId: test._id,
        testTitle: test.title || "Unknown Test",
        subject: test.subject || "General",
        totalMarks: maxMarks,
        duration: test.totalDurationMinutes || test.duration || 0,
        score: totalScore,
        totalTimeTaken,
        attemptNumber: attempt.attemptNumber,
        isSubmitted: attempt.isSubmitted,
        submittedAt: attempt.submittedAt,
        rank: attempt.rank ?? null,
        accuracy: parseFloat(accuracy.toFixed(2)),
        stats: {
          correct,
          incorrect,
          unattempted,
          positiveMarks,
          negativeMarks,
        },
      };
    });

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




export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔐 Verify admin credentials from env
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // 🔑 Generate tokens (same pattern as user)
    const accessToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 🍪 EXACT same cookie options as user
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res
      .cookie("adminAccessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("adminRefreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Admin login successful",
        email,
      });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(400).json({ message: err.message || "Admin login failed" });
  }
};



export const getAdminMe = (req, res) => {
  const accessToken = req.cookies.adminAccessToken;

  if (!accessToken) {
    return res.status(401).json({ admin: null });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    res.status(200).json({
      admin: {
        email: decoded.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ admin: null });
  }
};


/**
 * POST /api/admin/logout
 * Clear admin cookies
 */
export const adminLogout = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  };

  res
    .clearCookie("adminAccessToken", cookieOptions)
    .clearCookie("adminRefreshToken", cookieOptions)
    .status(200)
    .json({ message: "Admin logged out successfully" });
};

export const adminRefresh = (req, res) => {
  try {
    const refreshToken = req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const newAccessToken = jwt.sign(
      { email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("adminAccessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token expired" });
  }
};
