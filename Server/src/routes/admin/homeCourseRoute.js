import express from "express";
import {
  addHomeCourse,
  deleteHomeCourse,
  getHomeCourses,
} from "../../controllers/homeCourseController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/add-course", verifyAdmin, addHomeCourse);
router.delete("/delete-course/:id", verifyAdmin, deleteHomeCourse);
router.get("/get-courses", getHomeCourses);
export default router;
