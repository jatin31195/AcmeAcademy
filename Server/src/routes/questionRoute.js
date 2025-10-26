import express from "express";
import * as questionController from "../controllers/questionController.js"; 
const router = express.Router();

router.get("/search", questionController.searchQuestions);
router.get("/", questionController.getAllQuestions);
router.get("/subjects", questionController.getAllSubjects);
router.get("/subjects/:subject/topics", questionController.getTopicsBySubject);
router.get("/topic/:topic", questionController.getQuestionsByTopic);
router.get("/slug/:slug", questionController.getQuestionBySlug);
router.post("/", questionController.addQuestion);
router.post("/:id/discussion", questionController.addDiscussion);

export default router;
