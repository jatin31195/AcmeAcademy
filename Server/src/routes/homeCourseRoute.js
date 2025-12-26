import express from "express";
import { getHomeCourses } from ".././controllers/homeCourseController.js";

const router = express.Router();

router.get("/home-courses", getHomeCourses);

export default router;
