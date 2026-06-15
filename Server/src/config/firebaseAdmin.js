/**
 * config/firebaseAdmin.js
 * Server-side Firebase Admin SDK init for the NIMCET Rank Predictor.
 *
 * This runs ONLY on the backend with a privileged service account, so the
 * browser never gets Firestore access. Admin SDK bypasses Firestore security
 * rules, which lets us lock the client rules right down (deny-all) while the
 * server still reads/writes freely.
 *
 * Credentials are loaded from an environment variable (never committed):
 *   FIREBASE_SERVICE_ACCOUNT_JSON  — the service-account JSON, either as an
 *                                    inline string or a path to a .json file.
 * Falls back to GOOGLE_APPLICATION_CREDENTIALS (standard ADC) if unset.
 */

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let firestore = null;

function loadServiceAccount() {
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) return null;

  // A path to a .json file (resolved from the Server root) ...
  if (raw.endsWith(".json") && !raw.startsWith("{")) {
    const filePath = path.isAbsolute(raw)
      ? raw
      : path.resolve(__dirname, "../../", raw);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Service account file not found: ${filePath}`);
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  // ... otherwise treat it as inline JSON.
  const parsed = JSON.parse(raw);
  // When stored in an env var the private key's newlines are often escaped.
  if (parsed.private_key) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }
  return parsed;
}

/**
 * Returns a memoized Firestore instance, initializing the Admin app on first use.
 * Throws a clear error if no credentials are configured.
 */
export function getFirestore() {
  if (firestore) return firestore;

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Application Default Credentials (e.g. a mounted key file / workload identity).
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      throw new Error(
        "Firebase Admin not configured: set FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON or path) or GOOGLE_APPLICATION_CREDENTIALS."
      );
    }
  }

  firestore = admin.firestore();
  return firestore;
}

export default getFirestore;
