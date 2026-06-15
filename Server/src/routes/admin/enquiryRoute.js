import express from "express";
import { getEnquiries, deleteEnquiry } from "../../controllers/enquiryController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", verifyAdmin, getEnquiries);
router.delete("/:id", verifyAdmin, deleteEnquiry);

export default router;
