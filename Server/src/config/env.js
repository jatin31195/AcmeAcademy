/**
 * config/env.js
 * Centralised environment variable loading & validation for the
 * NIMCET Rank Predictor module (OTP + Firebase config).
 *
 * NOTE: Unlike the standalone project, a missing key here only WARNS
 * instead of killing the process — the rest of the ACME website must
 * keep running even if rank-predictor keys are not configured.
 */

import dotenv from "dotenv";

// The main server (server.js / db.js) already loads the root .env, but we
// call this defensively in case this module is imported in isolation.
dotenv.config();

const REQUIRED_VARS = [
  "TWO_FACTOR_API_KEY",
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

const missing = REQUIRED_VARS.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn(
    `\n⚠️  [rank-predictor] Missing env vars (OTP / Firebase routes will fail):\n   ${missing.join(
      "\n   "
    )}\n`
  );
}

const env = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  TWO_FACTOR_API_KEY: process.env.TWO_FACTOR_API_KEY,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
};

export const TWO_FACTOR_API_KEY = env.TWO_FACTOR_API_KEY;

export default env;
