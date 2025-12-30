import express from "express";
import { sendAdminMail } from "../../controllers/mailController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/send-mail", verifyAdmin, sendAdminMail);

export default router;
