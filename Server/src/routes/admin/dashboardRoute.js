import express from "express";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";
import { getDashboardOverview } from "../../controllers/dashboardController.js";

const router = express.Router();

router.get("/overview", verifyAdmin, getDashboardOverview);

export default router;
