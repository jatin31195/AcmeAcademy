import express from "express";
import * as questionController from "../../controllers/questionController.js";
import { upload } from "../../utils/multerCloudinary.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();
router.get("/search", questionController.searchQuestions);
router.get("/", questionController.getAllQuestions);
router.get("/topics", questionController.getAllTopics);
router.get("/practice-topic/:practiceTopicId/topics", questionController.getTopicsByPracticeTopic);
router.get("/practice-topic/:practiceTopicId/topics/:topic", questionController.getQuestionsByPracticeTopicAndTopic);
router.get("/q/slug/:slug", questionController.getQuestionBySlug);
router.post("/", verifyAdmin, upload.single("solutionImage"), questionController.addQuestion);
router.put("/:id", verifyAdmin, upload.single("solutionImage"), questionController.updateQuestion);
router.delete("/:id", verifyAdmin, questionController.deleteQuestion);
router.patch("/:id/discussion", verifyAdmin, questionController.addDiscussion);

export default router;
