import express from "express";
import {
  createSubject,
  getSubjectsByCourse,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../../controllers/subjectController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/", verifyAdmin, createSubject);
router.get("/course/:courseId",  getSubjectsByCourse);
router.get("/:id", getSubjectById);
router.put("/:id", verifyAdmin, updateSubject);
router.delete("/:id", verifyAdmin, deleteSubject);

export default router;
