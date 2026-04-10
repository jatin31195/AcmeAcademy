import express from "express";
import {
	getAllUsers,
	getUserById,
	updateUserByAdmin,
} from "../../controllers/userController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/:userId", verifyAdmin, getUserById);
router.put("/:userId", verifyAdmin, updateUserByAdmin);

export default router;
