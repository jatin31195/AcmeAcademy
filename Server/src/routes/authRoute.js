import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser,
  updateProfile,
  submitVerificationProfile,
  getProfile,
  getUserTestAttempts,
  sendEmailOtp,
  verifyEmailOtp,
  adminUpdateVerificationProfile,
} from "../controllers/authController.js";
import { verifyUser } from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminAuthMiddleware.js";
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
router.post(
  "/verification-profile",
  verifyUser,
  upload.any(),
  submitVerificationProfile
);

router.patch(
  "/admin/verification-profile/:userId",
  verifyAdmin,
  adminUpdateVerificationProfile
);
router.get("/user/all-test", verifyUser, getUserTestAttempts);
router.post("/send-otp", sendEmailOtp);
router.post("/verify-otp", verifyEmailOtp);
export default router;
