import express from "express";
import { sendCounsellingMail } from "../controllers/mailController.js";

const router = express.Router();

router.post("/send-counselling-mail", sendCounsellingMail);

export default router;
