import express from "express";
import * as questionController from "../controllers/questionController.js";
import { upload } from "../utils/multerCloudinary.js";

const router = express.Router();
router.get("/search", questionController.searchQuestions);
router.get("/", questionController.getAllQuestions);
router.post("/", upload.single("solutionImage"), questionController.addQuestion);
router.put("/:id", upload.single("solutionImage"), questionController.updateQuestion);
router.patch("/:id/discussion", questionController.addDiscussion);
router.get("/topics", questionController.getAllTopics);
router.get(
  "/practice-topic/:practiceTopicId/topics",
  questionController.getTopicsByPracticeTopic
);
router.get(
  "/practice-topic/:practiceTopicId/topics/:topic",
  questionController.getQuestionsByPracticeTopicAndTopic
);
router.get("/q/slug/:slug", questionController.getQuestionBySlug);

export default router;
