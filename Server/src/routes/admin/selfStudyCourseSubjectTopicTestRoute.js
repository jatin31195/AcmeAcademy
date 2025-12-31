import express from "express";
import {
  createTest,
  addQuestionsToTest,
  uploadSolutionImage,
  updateQuestionSolution,
  getTestsByTopic,
  getTestByIdAdmin,
  updateTest,
  deleteTest,
  updateQuestion,
  deleteQuestion,

} from "../../controllers/testController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { upload } from "../../utils/multerCloudinary.js";

const router = express.Router();

/* =======================
   TEST CRUD (ADMIN)
======================= */

// create test
router.post("/", verifyAdmin, createTest);

// get all tests for a topic
router.get("/topic/:topicId", verifyAdmin, getTestsByTopic);

// get full test (with questions + solutions)
router.get("/:testId", verifyAdmin, getTestByIdAdmin);

// update test meta
router.put("/:testId", verifyAdmin, updateTest);

// delete test
router.delete("/:testId", verifyAdmin, deleteTest);

// add questions
router.patch("/:testId/add-questions", verifyAdmin, addQuestionsToTest);

// upload solution image
router.post(
  "/upload-solution",
  verifyAdmin,
  upload.single("file"),
  uploadSolutionImage
);

// update question solution
router.patch(
  "/:testId/questions/:questionId/solution",
  verifyAdmin,
  updateQuestionSolution
);
// update full question
router.put(
  "/:testId/questions/:questionId",
  verifyAdmin,
  updateQuestion
);

// delete question
router.delete(
  "/:testId/questions/:questionId",
  verifyAdmin,
  deleteQuestion
);

export default router;
