import express from "express";
import {
  createTopic,
  getTopicsBySubject,
  updateTopic,
  deleteTopic,
} from "../../controllers/topicController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();
router.post("/", verifyAdmin, createTopic);
router.get("/subject/:subjectId", getTopicsBySubject);
router.put("/:id", verifyAdmin, updateTopic);
router.delete("/:id", verifyAdmin, deleteTopic);

export default router;
