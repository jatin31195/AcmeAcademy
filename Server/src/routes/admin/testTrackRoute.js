import express from "express";
import {
  getTestForUser,
  getUserTestHistory,
  getUserTestResult,
  getUserTestResultByAttempt,
  getUserPerformanceAnalytics,
} from "../../controllers/testController.js";
import { verifyAdmin } from "../../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.get("/test/:id", verifyAdmin, getTestForUser);

// View all attempts of a user for a test
router.get(
  "/user/:userId/test/:testId/history",
  verifyAdmin,
  getUserTestHistory
);

// View user's latest test result
router.get(
  "/user/:userId/test/:testId/result",
  verifyAdmin,
  getUserTestResult
);

// View specific attempt of a user
router.get(
  "/user/:userId/test/:testId/attempt/:attemptNumber",
  verifyAdmin,
  getUserTestResultByAttempt
);

// View performance analytics of a user (across tests)
router.get(
  "/user/:userId/performance/analytics",
  verifyAdmin,
  getUserPerformanceAnalytics
);

export default router;
