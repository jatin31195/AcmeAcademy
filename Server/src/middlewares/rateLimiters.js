/**
 * middlewares/rateLimiters.js
 * Rate-limit configurations for the NIMCET Rank Predictor OTP routes.
 *
 * Sized for NIMCET result/counselling spikes (1000–2000 concurrent users).
 * The key design rule for the verify limiter: NEVER key by IP, because on
 * Indian mobile networks (Jio/Airtel CGNAT) and coaching-center WiFi, thousands
 * of unrelated users egress through the SAME public IP. An IP-keyed bucket
 * therefore collapses them all together and rejects correct OTPs under load.
 */

import rateLimit from "express-rate-limit";

/** Max 5 OTP sends per 15 min, keyed by phone number */
export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  // Phone-based key — falls back to IP string if phone is not in body.
  // Phone keying is correct here: it caps SMS cost/abuse per number and, unlike
  // IP, never lumps different users together.
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

/**
 * FIX 1 — Verify limiter keyed by 2Factor sessionId (NOT by IP).
 *
 * Each OTP request from 2Factor yields a unique sessionId that belongs to
 * exactly one user's one OTP. Keying on it means:
 *   • Every user gets a private verification bucket — concurrent users on the
 *     same NAT/CGNAT IP can never throttle each other.
 *   • Brute-force protection is preserved: a 4–8 digit OTP can only be guessed
 *     `max` times per session before that session is locked out.
 *
 * Capacity: 10 attempts per session / 15 min is plenty for a legitimate user
 * (type + a couple of retries) while still capping guessing. Because the key is
 * per-session, total throughput scales linearly with the number of users — so
 * this comfortably handles the 1000–2000 concurrent NIMCET-result spike.
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // attempts per OTP session (brute-force guard) — preserved from the IP-based version
  // ── Why NOT key by IP (express-rate-limit's default req.ip) ──
  // On hostel/coaching/college WiFi and Jio/Airtel CGNAT, thousands of unrelated
  // users share ONE public IP. An IP-keyed bucket lumps them into a single
  // counter, so under concurrent load correct OTPs get rejected (HTTP 429) once
  // any ~10 verifications happen on that shared IP within the window.
  //
  // ── Why keying by sessionId is safer for OTP verification ──
  // Each 2Factor sessionId is a unique, unguessable UUID that belongs to exactly
  // ONE user's ONE OTP. Keying on it gives every user a private bucket (so shared
  // WiFi/CGNAT users never throttle each other) while STILL bounding brute force:
  // a 4–8 digit OTP can only be guessed `max` times against its own session.
  keyGenerator: (req) => {
    const sid = req.body?.sessionId || req.query?.sessionId;

    return sid
      ? `sess_${sid}`
      : (req.ip || "unknown"); // fallback only for malformed requests with no sessionId
  },
  // We supply our own non-IP key, so disable express-rate-limit's proxy/IP checks.
  validate: { xForwardedForHeader: false, trustProxy: false, keyGeneratorIpFallback: false },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false, // keep counting wrong OTPs — that IS the brute-force we cap
  // Structured log whenever a verify is throttled, so the 429 rate is observable
  // in production instead of being silently surfaced to users as "Invalid OTP".
  handler: (req, res, _next, options) => {
    const sid = req.body?.sessionId || req.query?.sessionId;
    console.warn(
      JSON.stringify({
        tag: "OTP_VERIFY_RATELIMITED",
        sessionId: sid || null,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      })
    );
    res.status(options.statusCode).json(options.message);
  },
  message: {
    status: "Error",
    message: "Too many verification attempts for this OTP. Please request a new OTP.",
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
