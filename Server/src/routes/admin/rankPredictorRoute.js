import express from "express";
import {
  getRankPredictorUsers,
  updateRankPredictorUser,
  deleteRankPredictorUser,
} from "../../controllers/rankPredictorController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// Every route is admin-only.
router.get("/", verifyAdmin, getRankPredictorUsers);
router.put("/:id", verifyAdmin, updateRankPredictorUser);
router.delete("/:id", verifyAdmin, deleteRankPredictorUser);

export default router;
