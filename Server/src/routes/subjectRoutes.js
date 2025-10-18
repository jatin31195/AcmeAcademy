import express from "express";
import { createSubject, getSubjectsByCourse, getSubjectById } from "../controllers/subjectController.js";

const router = express.Router();
router.post("/", createSubject);
router.get("/course/:courseId", getSubjectsByCourse);
router.get("/:id", getSubjectById);

export default router;
