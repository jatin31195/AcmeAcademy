import User from "../models/User.js";
import Test from "../models/Test.js";
import Topic from "../models/Topic.js";
import UserTestAttempt from "../models/UserTestAttempt.js";

/**
 * GET /api/admin/dashboard/overview
 * Admin dashboard aggregated analytics
 */
export const getDashboardOverview = async (req, res) => {
  try {
    /* ---------------------------------- */
    /* BASIC COUNTS */
    /* ---------------------------------- */
    const [
      totalUsers,
      totalTests,
      totalTopics,
    ] = await Promise.all([
      User.countDocuments(),
      Test.countDocuments(),
      Topic.countDocuments(),
    ]);

    /* ---------------------------------- */
    /* QUESTIONS BANK */
    /* ---------------------------------- */
    const tests = await Test.find({}, { totalQuestions: 1 });
    const questionBank = tests.reduce(
      (sum, t) => sum + (t.totalQuestions || 0),
      0
    );

    /* ---------------------------------- */
    /* RECENT ACTIVITY (CLICKABLE) */
    /* ---------------------------------- */
    const recentAttempts = await UserTestAttempt.find({ isSubmitted: true })
      .sort({ submittedAt: -1 })
      .limit(10)
      .populate("user", "fullname username")
      .populate("test", "title totalMarks");

    const recentActivity = recentAttempts.map((a) => ({
      attemptId: a._id,
      userId: a.user?._id,
      testId: a.test?._id,

      user: a.user?.fullname || a.user?.username || "Unknown User",
      testTitle: a.test?.title || "Test",

      attemptNumber: a.attemptNumber,
      score: a.score,
      totalMarks: a.test?.totalMarks || 0,

      accuracy:
        a.test?.totalMarks > 0
          ? Number(((a.score / a.test.totalMarks) * 100).toFixed(2))
          : 0,

      time: timeAgo(a.submittedAt),
      submittedAt: a.submittedAt,
    }));

    /* ---------------------------------- */
    /* TOP PERFORMERS (CLICKABLE USERS) */
    /* ---------------------------------- */
    const topAgg = await UserTestAttempt.aggregate([
      { $match: { isSubmitted: true } },
      {
        $group: {
          _id: "$user",
          avgScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
        },
      },
      { $sort: { avgScore: -1 } },
      { $limit: 5 },
    ]);

    const userIds = topAgg.map((u) => u._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select("fullname username");

    const topPerformers = topAgg.map((p) => {
      const user = users.find(
        (u) => u._id.toString() === p._id.toString()
      );

      return {
        userId: p._id,
        name: user?.fullname || user?.username || "Unknown",
        course: "Multiple Tests",
        avgScore: Number(p.avgScore.toFixed(2)),
        tests: p.totalAttempts,
      };
    });

    /* ---------------------------------- */
    /* FINAL RESPONSE */
    /* ---------------------------------- */
    res.status(200).json({
      stats: {
        totalUsers,
        activeCourses: totalTopics,
        totalTests,
        questionBank,
      },
      recentActivity,
      topPerformers,
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({
      message: "Failed to load dashboard analytics",
      error: err.message,
    });
  }
};

/* ---------------------------------- */
/* HELPER: Time Ago */
/* ---------------------------------- */
const timeAgo = (date) => {
  if (!date) return "-";
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", secs: 31536000 },
    { label: "month", secs: 2592000 },
    { label: "day", secs: 86400 },
    { label: "hour", secs: 3600 },
    { label: "minute", secs: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.secs);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }

  return "Just now";
};
