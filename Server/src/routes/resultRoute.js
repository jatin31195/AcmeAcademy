import express from "express";
import {
  getResultsByYear,
  getResultByRank,
  uploadResultPhoto,
  addGalleryImage,
  getGalleryImages,
  getTopResults,
  getCombinedResultImages,
  getAvailableYearsByExam,
  getAvailableExams
} from "../controllers/resultController.js";
import { upload } from "../utils/multerCloudinary.js";
const router = express.Router();
router.get("/top/all", getTopResults);
router.get("/gallery/all", getGalleryImages);
router.post("/upload", upload.single("photo"), uploadResultPhoto);
router.post("/gallery/add", upload.single("photo"), addGalleryImage);
router.get("/years/:exam", getAvailableYearsByExam);
router.get("/exams", getAvailableExams);
router.get("/combined", getCombinedResultImages);
router.get("/:exam/:year/air-:rank", getResultByRank);
router.get("/:exam/:year", getResultsByYear);
export default router;
