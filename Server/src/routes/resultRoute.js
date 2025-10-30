import express from "express";
import {
  getResultsByYear,
  getResultByRank,
  uploadResultPhoto,
  addGalleryImage,
  getPastGallery,
  getTopResults,
} from "../controllers/resultController.js";
import { upload } from "../utils/multerCloudinary.js";
const router = express.Router();
router.get("/top/all", getTopResults);
router.get("/gallery/all", getPastGallery);
router.post("/upload", upload.single("photo"), uploadResultPhoto);
router.post("/gallery/add", upload.single("image"), addGalleryImage);


router.get("/:exam/:year/air-:rank", getResultByRank);
router.get("/:exam/:year", getResultsByYear);

export default router;
