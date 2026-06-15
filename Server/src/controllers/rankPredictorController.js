import { getFirestore } from "../config/firebaseAdmin.js";

const COLLECTION = "nimcet_users";

// Only these fields may be written — never trust arbitrary keys.
// `rank` is intentionally excluded: it is a derived value and must not be
// editable via the admin panel (matches the original tool's behaviour).
const EDITABLE_FIELDS = [
  "name",
  "phone",
  "marks",
  "category",
  "regNo",
  "city",
  "state",
];

/**
 * GET /api/admin/rank-predictor
 * Admin-only: list all rank-predictor submissions from Firestore.
 */
export const getRankPredictorUsers = async (req, res) => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection(COLLECTION).get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ users });
  } catch (err) {
    console.error("Rank predictor list error:", err);
    res.status(500).json({ error: "Failed to fetch rank-predictor users" });
  }
};

/**
 * PUT /api/admin/rank-predictor/:id
 * Admin-only: update one submission (whitelisted fields).
 */
export const updateRankPredictorUser = async (req, res) => {
  try {
    const db = getFirestore();
    const payload = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in req.body) {
        payload[field] = String(req.body[field] ?? "").trim();
      }
    }
    if (!Object.keys(payload).length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    await db.collection(COLLECTION).doc(req.params.id).update(payload);
    res.status(200).json({ message: "Updated" });
  } catch (err) {
    console.error("Rank predictor update error:", err);
    res.status(500).json({ error: "Failed to update entry" });
  }
};

/**
 * DELETE /api/admin/rank-predictor/:id
 * Admin-only: delete one submission.
 */
export const deleteRankPredictorUser = async (req, res) => {
  try {
    const db = getFirestore();
    await db.collection(COLLECTION).doc(req.params.id).delete();
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    console.error("Rank predictor delete error:", err);
    res.status(500).json({ error: "Failed to delete entry" });
  }
};
