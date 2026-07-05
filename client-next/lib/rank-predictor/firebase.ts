// Ported from client/src/features/rank-predictor/Firebase.js.
// Firebase config is fetched from the ACME backend at runtime
// (GET /api/config/firebase) and used to init Firestore for the
// NIMCET Rank Predictor. Retries with exponential back-off to handle
// Render free-tier cold-start delays (can take 30-50 s).
//
// This module is only ever imported by Client Components that are
// next/dynamic-loaded with { ssr: false } (otp-auth and form pages), so it
// never executes during SSR and never enters the shared/initial bundle —
// the Next.js equivalent of the original's React.lazy-based isolation.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { BASE_URL } from "@/lib/config";

async function fetchWithRetry(url: string, retries = 6, delayMs = 3000): Promise<Response | undefined> {
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

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
  const res = await fetchWithRetry(`${BASE_URL}/api/config/firebase`);
  const firebaseConfig = await res!.json();
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  console.info("[Firebase] Initialized successfully.");
} catch (err) {
  console.error("[Firebase] Could not reach backend after multiple retries:", (err as Error).message);
  console.error("[Firebase] Backend URL:", BASE_URL);
  // db remains undefined — pages will redirect to the entry page if db is unavailable
}

export { app, db };
