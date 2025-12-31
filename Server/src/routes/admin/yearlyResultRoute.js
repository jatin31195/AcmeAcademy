import express from "express";
import {
  getResultsByYear,
  getResultByRank,
  getTopResults,
  getAvailableYearsByExam,
  getAvailableExams,
  updateResultById,
} from "../../controllers/resultController.js";
import { uploadResultPhoto, deleteResultImageById } from "../../controllers/resultController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { upload } from "../../utils/multerCloudinary.js";

const router = express.Router();

router.get("/top/all", getTopResults);
router.get("/years/:exam", getAvailableYearsByExam);
router.get("/exams", getAvailableExams);
router.get("/:exam/:year/air-:rank", getResultByRank);
router.get("/:exam/:year", getResultsByYear);


router.put(
  "/update-result/:id",
  verifyAdmin,
  upload.single("photo"), 
  updateResultById
);

router.post("/add-result", verifyAdmin, upload.single("photo"), uploadResultPhoto);
router.delete("/delete-result/:id", verifyAdmin, deleteResultImageById);

export default router;
