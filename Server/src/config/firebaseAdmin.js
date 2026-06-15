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

// Env vars checked, in order. FIREBASE_SERVICE_ACCOUNT_JSON is preferred;
// GOOGLE_SERVICE_ACCOUNT_JSON is the one the Flask app already uses, reused
// here if a dedicated Firebase key isn't configured.
const CRED_ENV_VARS = [
  "FIREBASE_SERVICE_ACCOUNT_JSON",
  "GOOGLE_SERVICE_ACCOUNT_JSON",
];

// Directories a relative .json path may live in.
const SEARCH_DIRS = [
  path.resolve(__dirname, "../../"), // Server/
  path.resolve(__dirname, "../../flask_app"), // Server/flask_app/ (Flask's key)
];

function resolveCredFile(raw) {
  if (path.isAbsolute(raw)) return fs.existsSync(raw) ? raw : null;
  for (const dir of SEARCH_DIRS) {
    const candidate = path.resolve(dir, raw);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// "No JSON" option: build the credential from three individual env vars.
// You still get these two values once, from a generated service-account key:
//   FIREBASE_CLIENT_EMAIL  → the key's "client_email"
//   FIREBASE_PRIVATE_KEY   → the key's "private_key" (keep the \n escapes)
// FIREBASE_PROJECT_ID you already have.
function normalizePrivateKey(raw) {
  let key = raw.trim();

  // Strip one pair of surrounding quotes if they slipped through.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Restore newlines no matter how they were escaped in .env, and
  // normalize Windows CRLF to LF so OpenSSL can decode the PEM.
  key = key
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  return key;
}

function loadServiceAccountFromFields() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) return null;

  const privateKey = normalizePrivateKey(rawKey);

  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "FIREBASE_PRIVATE_KEY is malformed (no PEM header found after parsing). " +
        "It was likely stored without surrounding double quotes, so the multi-line " +
        "key got truncated. Wrap the whole value in double quotes on ONE line with " +
        "literal \\n between lines, or use the FIREBASE_SERVICE_ACCOUNT_JSON file path instead."
    );
  }

  return { projectId, clientEmail, privateKey };
}

function loadServiceAccount() {
  for (const key of CRED_ENV_VARS) {
    const raw = (process.env[key] || "").trim();
    if (!raw) continue;

    let parsed;
    if (raw.startsWith("{")) {
      parsed = JSON.parse(raw); // inline JSON
    } else if (raw.endsWith(".json")) {
      const filePath = resolveCredFile(raw);
      if (!filePath) {
        throw new Error(`Service account file from ${key} not found: ${raw}`);
      }
      parsed = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } else {
      throw new Error(
        `${key} must be inline JSON (starting with '{') or a path to a .json file`
      );
    }

    // When stored in an env var the private key's newlines are often escaped.
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }
  return null;
}

/**
 * Returns a memoized Firestore instance, initializing the Admin app on first use.
 * Throws a clear error if no credentials are configured.
 */
export function getFirestore() {
  if (firestore) return firestore;

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();
    const fieldCreds = serviceAccount ? null : loadServiceAccountFromFields();
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
      });
    } else if (fieldCreds) {
      admin.initializeApp({
        credential: admin.credential.cert(fieldCreds),
        projectId: fieldCreds.projectId,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Application Default Credentials (e.g. a mounted key file / workload identity).
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    } else {
      throw new Error(
        "Firebase Admin not configured. Provide a service account via either: " +
          `(a) one of [${CRED_ENV_VARS.join(", ")}] as inline JSON or a .json path, or ` +
          "(b) the three vars FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, or " +
          "(c) GOOGLE_APPLICATION_CREDENTIALS. " +
          "NOTE: the public web-config keys (FIREBASE_API_KEY etc.) are NOT a service account."
      );
    }
  }

  firestore = admin.firestore();
  return firestore;
}

export default getFirestore;
