import express from "express";
import {
getCombinedResultImages,
addCombinedResultImage,
deleteCombinedResultImage
} from "../../controllers/resultController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { upload } from "../../utils/multerCloudinary.js";

const router = express.Router();
router.get("/get-image",getCombinedResultImages);
router.post("/add-image",addCombinedResultImage);
router.delete("/delete-image/:id",deleteCombinedResultImage);

export default router;