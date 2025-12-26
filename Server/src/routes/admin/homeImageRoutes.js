import express from "express";
import {
  getHomeResultImages,
  addHomeResultImage,
  deleteHomeResultImage,
} from "../../controllers/resultController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { upload } from "../../utils/multerCloudinary.js";

const router = express.Router();

/**
 * ADMIN – Home Result Images
 */

router.get("/", verifyAdmin, getHomeResultImages);
router.post("/add",verifyAdmin,upload.single("photo"),addHomeResultImage);
router.delete("/delete/:id",verifyAdmin,deleteHomeResultImage);

export default router;
