import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
  updateProfile,
  getProfile,
  getUserTestAttempts
} from "../controllers/authController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
import { upload } from "../utils/multerCloudinary.js";
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);
router.patch(
  "/update-profile",
 verifyUser,
  upload.single("profilePic"),
  updateProfile
);
router.get("/profile", verifyUser, getProfile);
router.get("/user/all-test", verifyUser, getUserTestAttempts);
export default router;
