import express from "express";
import { upload } from "../utils/multerCloudinary.js";
import * as questionController from "../controllers/mathQuestionController.js";

const router = express.Router();

router.get("/search", questionController.searchQuestions);
router.get("/", questionController.getAllQuestions);
router.get("/subjects", questionController.getAllSubjects);
router.get("/subjects/:subject/topics", questionController.getTopicsBySubject);
router.get("/subjects/:subject/topics/:topic", questionController.getQuestionsByTopic);
router.get("/q/slug/:slug", questionController.getQuestionBySlug);
router.post("/", upload.single("solutionImage"), questionController.addQuestion);
router.put("/:id", upload.single("solutionImage"), questionController.updateQuestion);

export default router;
