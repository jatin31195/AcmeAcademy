/**
 * routes/rankpredictorOtp.js
 * NIMCET Rank Predictor — phone OTP routes (send & verify) via 2factor.in.
 * Mounted at /api/otp.
 */

import express from "express";
import { TWO_FACTOR_API_KEY } from "../config/env.js";
import { otpSendLimiter, otpVerifyLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

// Node 20 ships a global fetch — no node-fetch dependency needed.

/* ─── Input helpers ─────────────────────── */
function isValidPhone(phone) {
  return typeof phone === "string" && /^\d{10}$/.test(phone.trim());
}
function isValidOtp(otp) {
  return typeof otp === "string" && /^\d{4,8}$/.test(otp.trim());
}
function isValidSessionId(id) {
  return typeof id === "string" && id.trim().length > 0;
}

/* ─────────────────────────────────────────
   POST /api/otp/send
   Body: { phone: "9876543210" }
   ───────────────────────────────────────── */
router.post("/send", otpSendLimiter, async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid phone number. Must be exactly 10 digits.",
      });
    }

    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/${phone.trim()}/AUTOGEN`;
    const response = await fetch(url);
    const data = await response.json();

    // Pass through 2factor.in response unchanged so the client can use data.Details (sessionId)
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

/* ─────────────────────────────────────────
   GET /api/otp/verify?sessionId=&otp=
   ───────────────────────────────────────── */
router.get("/verify", otpVerifyLimiter, async (req, res, next) => {
  try {
    const { sessionId, otp } = req.query;

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({ status: "Error", message: "Missing or invalid sessionId." });
    }
    if (!isValidOtp(otp)) {
      return res.status(400).json({ status: "Error", message: "Invalid OTP format." });
    }

    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId.trim()}/${otp.trim()}`;
    const response = await fetch(url);
    const data = await response.json();

    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
