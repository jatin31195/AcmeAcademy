import User from "../models/User.js";

/**
 * GET /api/admin/users
 * Fetch all users (admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("fullname username email createdAt")
      .sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => ({
      id: u._id,
      name: u.fullname || u.username,
      email: u.email,
      role: "Student", // future-proof (admin/instructor later)
      status: "Active", // you can wire this later
      joined: u.createdAt.toISOString().split("T")[0],
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
      total: formattedUsers.length,
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
