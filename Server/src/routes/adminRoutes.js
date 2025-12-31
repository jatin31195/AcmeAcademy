import express from "express";
import authRoute from "./admin/authRoute.js";
import selfStudyCourseRoute from "./admin/selfStudyCourseRoute.js";
import selfStudyCourseSubjectRoute from "./admin/selfStudyCourseSubjectRoute.js";
import selfStudyCourseSubjectTopicRoute from "./admin/selfStudyCourseSubjectTopicRoute.js"
import selfStudyCourseSubjectTopicTestRoute from "./admin/selfStudyCourseSubjectTopicTestRoute.js"
import adminHomeImageRoutes from "./admin/homeImageRoutes.js";
import homeNoticeRoute from "./admin/homeNoticeRoute.js"
import combinedResultImageRoute from "./admin/combinedResultImageRoute.js";
import yearlyResultRoute from "./admin/yearlyResultRoute.js"
import homeCourseRoute from "./admin/homeCourseRoute.js"
import practiceSetRoute from "./admin/practiceSetRoute.js"
import practiceSetTopicRoute from "./admin/practiceSetTopicRoute.js"
import practiceSetTopicQuestionRoute from "./admin/practiceSetTopicQuestionRoute.js";
import sendMailRoute from "./admin/sendMailRoute.js";
import testTrackRoute from "./admin/testTrackRoute.js";
import pyqRoute from "./admin/pyqRoute.js"
import dashboardRoute from "./admin/dashboardRoute.js"
import userRoute from "./admin/userRoute.js"
const router = express.Router();
router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/selfstudy", selfStudyCourseRoute);
router.use("/selfstudy/subjects", selfStudyCourseSubjectRoute);
router.use("/selfstudy/topic",selfStudyCourseSubjectTopicRoute);
router.use("/selfstudy/topic/test",selfStudyCourseSubjectTopicTestRoute);
router.use("/home-image",adminHomeImageRoutes);
router.use("/home-notice",homeNoticeRoute);
router.use("/combined-result",combinedResultImageRoute);
router.use("/yearly-result",yearlyResultRoute);
router.use("/home-course",homeCourseRoute);
router.use("/practice-set",practiceSetRoute);
router.use("/practice-set/t",practiceSetTopicRoute);
router.use("/practice-set/topic/q",practiceSetTopicQuestionRoute);
router.use("/mail",sendMailRoute);
router.use("/test",testTrackRoute);
router.use("/pyq",pyqRoute);
router.use("/dashboard", dashboardRoute);
export default router;