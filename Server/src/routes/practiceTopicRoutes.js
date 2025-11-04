import express from "express";
import {
  createPracticeTopic,
  getTopicsByPracticeSet,
  getTopicById,
} from "../controllers/practiceTopicController.js";

const router = express.Router();
router.post("/", createPracticeTopic);
router.get("/:practiceSetId", getTopicsByPracticeSet);
router.get("/topic/:id", getTopicById);

export default router;
