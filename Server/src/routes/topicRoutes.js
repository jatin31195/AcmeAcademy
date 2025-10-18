import express from "express";
import { createTopic, getTopicsBySubject } from "../controllers/topicController.js";

const router = express.Router();
router.post("/", createTopic);
router.get("/subject/:subjectId", getTopicsBySubject);

export default router;
