import express from "express";
import { getAllUsers } from "../../controllers/userController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);

export default router;
