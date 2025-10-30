import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

export default router;
