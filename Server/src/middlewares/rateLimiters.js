/**
 * middlewares/rateLimiters.js
 * Rate-limit configurations for the NIMCET Rank Predictor OTP routes.
 */

import rateLimit from "express-rate-limit";

/** Max 5 OTP sends per 15 min, keyed by phone number */
export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  // Phone-based key — falls back to IP string if phone is not in body
  keyGenerator: (req) => {
    const phone = req.body?.phone;
    return phone && /^\d{10}$/.test(phone) ? `phone_${phone}` : req.ip ?? "unknown";
  },
  // Suppress the IPv6 check — we handle key collisions ourselves above
  validate: { xForwardedForHeader: false, trustProxy: false, keyGeneratorIpFallback: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "Error",
    message: "Too many OTP requests. Please wait 15 minutes and try again.",
  },
});

/** Max 10 OTP verifications per IP per 15 min */
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false, trustProxy: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "Error",
    message: "Too many verification attempts. Please try again later.",
  },
});

/** General API limiter — 60 req/min per IP (available, not applied globally) */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  validate: { xForwardedForHeader: false, trustProxy: false },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "Error",
    message: "Too many requests. Please slow down.",
  },
});
