import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../controllers/courseController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

// Admin – Self Study Courses
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", verifyAdmin, createCourse);
router.put("/:id", verifyAdmin, updateCourse);
router.delete("/:id", verifyAdmin, deleteCourse);

export default router;
