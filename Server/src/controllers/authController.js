import * as userService from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import UserTestAttempt from "../models/UserTestAttempt.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const otpStore = new Map();
const verifiedEmails = new Set();
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const existingUser = await userService.getUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore.set(email, { otp, createdAt: Date.now() });

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


    const mailOptions = {
      from: `"ACME Academy" <acmeacademy15@gmail.com>`,
      to: email,
      subject: "Your ACME Academy OTP Verification Code",
      html: `
        <div style="font-family:Arial;padding:20px;background:#f9f9f9;border-radius:10px;">
          <h2 style="color:#4F46E5;">🔐 Email Verification</h2>
          <p>Dear Student,</p>
          <p>Your OTP for ACME Academy registration is:</p>
          <h1 style="color:#E11D48;letter-spacing:5px;">${otp}</h1>
          <p>This code will expire in <b>5 minutes</b>.</p>
          <p style="font-size:13px;color:#777;">If you didn’t request this, ignore this email.</p>
        </div>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyEmailOtp = (req, res) => {
  try {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored) return res.status(400).json({ message: "No OTP found" });

    const isExpired = Date.now() - stored.createdAt > 5 * 60 * 1000;
    if (isExpired) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // ✅ Mark email as verified
    verifiedEmails.add(email);
    otpStore.delete(email);

    res.status(200).json({ verified: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error verifying OTP" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, fullname, email, password, dob, whatsapp } = req.body;

    if (!verifiedEmails.has(email)) {
      return res.status(403).json({
        message: "Please verify your email before registration",
      });
    }

    verifiedEmails.delete(email);

    const existingEmail = await userService.getUserByEmail(email);
    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    // ✅ Create user
    const user = await userService.createUser({
      username,
      fullname,
      email,
      password,
      dob,
      whatsapp,
    });

   
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
          Dear <strong>${fullname || "Student"}</strong>,
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
      from: `"ACME Academy" <acmeacademy15@gmail.com>`,
      to: email,
      subject: "🎉 Welcome to ACME Academy — Let’s Begin Your MCA Journey!",
      html: mailHTML,
    };

   
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User created successfully and welcome email sent!",
      userId: user._id,
    });
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


export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  }

  const adminToken = jwt.sign(
    {
      email,
      role: "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: "/", // important
  };

  res
    .cookie("adminToken", adminToken, cookieOptions)
    .status(200)
    .json({
      message: "Admin login successful",
    });
};
