import express from "express";
import {
  createPracticeSet,
  getAllPracticeSets,
  getPracticeSetById,
  updatePracticeSet,
  deletePracticeSet,
} from "../../controllers/practiceSetController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();
router.get("/", getAllPracticeSets);
router.get("/:id", getPracticeSetById);
router.post("/", verifyAdmin, createPracticeSet);
router.put("/:id", verifyAdmin, updatePracticeSet);
router.delete("/:id", verifyAdmin, deletePracticeSet);

export default router;
