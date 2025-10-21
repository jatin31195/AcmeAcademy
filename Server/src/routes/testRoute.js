import express from "express";
import multer from "multer";
import { cloudinaryStorage } from "../utils/multerCloudinary.js";
import {
  createTest,
  addQuestionsToTest,
  uploadSolutionImage,
  getTestForUser,
  submitTest,
  getUserTestHistory,
  getUserTestResult,
  updateQuestionSolution,
} from "../controllers/testController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: cloudinaryStorage });

// Create a new test
router.post("/", createTest);

// Add questions later (incremental upload)
router.patch("/:testId/add-questions", addQuestionsToTest);

// Upload a solution image to Cloudinary
router.post("/upload-solution", upload.single("file"), uploadSolutionImage);

// Update solution for a question
router.patch("/:testId/questions/:questionId/solution", updateQuestionSolution);

// Fetch test (without solutions)
router.get("/:id", verifyUser, getTestForUser);

// Submit a test
router.post("/:id/submit", verifyUser, submitTest);

// Get user's past attempts
router.get("/:userId/:testId/history", verifyUser, getUserTestHistory);

// Get user's latest result
router.get("/:testId/result", verifyUser, getUserTestResult);

export default router;
