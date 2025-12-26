import express from "express";
import * as pyqController from "../../controllers/pyqController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { upload } from "../../utils/multerCloudinary.js";

const router = express.Router();
router.post(
  "/",
  verifyAdmin,
  upload.single("file"),
  pyqController.addPYQController
);

router.post(
  "/bulk",
  verifyAdmin,
  upload.array("pdfs"),
  pyqController.addBulkPYQController
);
router.get("/", pyqController.getPYQs);
router.get("/:id", pyqController.getPYQ);
export default router;
