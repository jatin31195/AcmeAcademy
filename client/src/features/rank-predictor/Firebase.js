// src/features/rank-predictor/Firebase.js
// Firebase config is fetched from the ACME backend at runtime
// (GET /api/config/firebase) and used to init Firestore for the
// NIMCET Rank Predictor. Retries with exponential back-off to handle
// Render free-tier cold-start delays (can take 30-50 s).
//
// This module is only loaded when the rank-predictor pages are visited
// (they are lazy-loaded), so firebase is NOT bundled into the main site.

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { BASE_URL } from "../../config.js";

/**
 * Fetch with automatic retry and exponential back-off.
 * @param {string} url
 * @param {number} retries   — max attempts (default 6)
 * @param {number} delayMs   — initial delay between retries (doubles each time)
 */
async function fetchWithRetry(url, retries = 6, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (res.ok) return res;
      throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(
        `[Firebase] Backend not ready yet (attempt ${attempt}/${retries}). ` +
        `Retrying in ${delayMs / 1000}s… (Render may be waking up)`
      );
      await new Promise((r) => setTimeout(r, delayMs));
      delayMs = Math.min(delayMs * 1.5, 15000); // cap at 15 s
    }
  }
}

let app;
let db;

try {
  const res = await fetchWithRetry(`${BASE_URL}/api/config/firebase`);
  const firebaseConfig = await res.json();
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  console.info("[Firebase] Initialized successfully.");
} catch (err) {
  console.error("[Firebase] Could not reach backend after multiple retries:", err.message);
  console.error("[Firebase] Backend URL:", BASE_URL);
  // db remains undefined — pages will redirect to the entry page if db is unavailable
}

export { app, db };
