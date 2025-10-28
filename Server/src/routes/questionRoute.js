import express from "express";
import * as questionController from "../controllers/questionController.js"; 
import { upload } from "../utils/multerCloudinary.js";
const router = express.Router();

router.get("/search", questionController.searchQuestions);
router.get("/", questionController.getAllQuestions);
router.get("/subjects", questionController.getAllSubjects);
router.get("/subjects/:subject/topics", questionController.getTopicsBySubject);
router.get("/subjects/:subject/topics/:topic", questionController.getQuestionsByTopic);
router.get("/q/slug/:slug", questionController.getQuestionBySlug);
router.post("/", upload.single("solutionImage"), questionController.addQuestion);

router.post("/:id/discussion", questionController.addDiscussion);

export default router;
