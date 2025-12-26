import express from "express";
import { upload } from "../../utils/multerCloudinary.js";
import {
  createTest,
  addQuestionsToTest,
  uploadSolutionImage,
  updateQuestionSolution,
} from "../../controllers/testController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
const router = express.Router();
router.post("/", verifyAdmin, createTest);
router.patch("/:testId/add-questions", verifyAdmin, addQuestionsToTest);
router.post(
  "/upload-solution",
  verifyAdmin,
  upload.single("file"),
  uploadSolutionImage
);
router.patch(
  "/:testId/questions/:questionId/solution",
  verifyAdmin,
  updateQuestionSolution
);

export default router;
