import express from "express";
import { adminLogin,getAdminMe,
  adminLogout, adminRefresh} from "../../controllers/authController.js";

const router = express.Router();


router.post("/login", adminLogin);
router.get("/me", getAdminMe);
router.post("/logout", adminLogout);
router.post("/refresh", adminRefresh);

export default router;
