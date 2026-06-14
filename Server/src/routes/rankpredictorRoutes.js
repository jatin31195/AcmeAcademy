/**
 * routes/rankpredictorRoutes.js
 * NIMCET Rank Predictor — serves Firebase client config from server-side env.
 * Mounted at /api/config.
 */

import express from "express";
import env from "../config/env.js";

const router = express.Router();

/* ─────────────────────────────────────────
   GET /api/config/firebase
   ───────────────────────────────────────── */
router.get("/firebase", (req, res) => {
  // Only return the minimum fields the Firebase SDK needs
  res.json({
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
  });
});

export default router;
