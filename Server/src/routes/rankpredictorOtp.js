/**
 * routes/rankpredictorOtp.js
 * NIMCET Rank Predictor — phone OTP routes (send & verify) via 2factor.in.
 * Mounted at /api/otp.
 *
 * FIX 4 — /verify is now a POST with a JSON body { sessionId, otp } instead of
 *         a GET with query params. This keeps the OTP/sessionId out of URLs,
 *         server logs and any intermediary cache keys.
 * FIX 5 — structured JSON logs (OTP_SEND / OTP_VERIFY) for production
 *         diagnostics during high-traffic counselling periods.
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

    // FIX 5 — structured diagnostics. Details holds the 2Factor sessionId on success.
    console.log(
      JSON.stringify({
        tag: "OTP_SEND",
        phone: phone.trim(),
        sessionId: data?.Status === "Success" ? data?.Details : null,
        status: data?.Status ?? null,
        timestamp: new Date().toISOString(),
      })
    );

    // Pass through 2factor.in response unchanged so the client can use data.Details (sessionId)
    return res.json(data);
  } catch (err) {
    next(err);
  }
});

/* ─────────────────────────────────────────
   POST /api/otp/verify
   Body: { sessionId: "...", otp: "123456" }
   (FIX 4 — converted from GET query params to POST body)
   ───────────────────────────────────────── */
router.post("/verify", otpVerifyLimiter, async (req, res, next) => {
  try {
    const { sessionId, otp } = req.body;

    if (!isValidSessionId(sessionId)) {
      return res.status(400).json({ status: "Error", message: "Missing or invalid sessionId." });
    }
    if (!isValidOtp(otp)) {
      return res.status(400).json({ status: "Error", message: "Invalid OTP format." });
    }

    const url = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId.trim()}/${otp.trim()}`;
    const response = await fetch(url);
    const data = await response.json();

    // FIX 5 — structured diagnostics distinguishing a real 2Factor rejection
    // (status "Error", details "OTP Mismatch/Expired") from infra/throttle issues.
    console.log(
      JSON.stringify({
        tag: "OTP_VERIFY",
        sessionId: sessionId.trim(),
        status: data?.Status ?? null,
        details: data?.Details ?? null,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      })
    );

    return res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
