import express from "express";
import {
  createPracticeTopic,
  getTopicsByPracticeSet,
  getTopicById,
  updatePracticeTopic,
  deletePracticeTopic,
} from "../../controllers/practiceTopicController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();
router.get("/:practiceSetId", getTopicsByPracticeSet);
router.get("/topic/:id", getTopicById);
router.post("/", verifyAdmin, createPracticeTopic);
router.put("/:id", verifyAdmin, updatePracticeTopic);
router.delete("/:id", verifyAdmin, deletePracticeTopic);

export default router;
