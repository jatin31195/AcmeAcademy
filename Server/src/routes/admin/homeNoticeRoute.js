import express from "express";
import {
  addNotice,
  deleteNotice,
  getAllNoticesAdmin,
   addBulkNotices,
   updateNotice
} from "../../controllers/noticeController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllNoticesAdmin);
router.post("/add", verifyAdmin, addNotice);
router.delete("/delete/:id", verifyAdmin, deleteNotice);
router.post("/add-bulk", verifyAdmin, addBulkNotices);
router.put("/edit/:id", verifyAdmin, updateNotice);
export default router;
