import jwt from "jsonwebtoken";

export const getMe = (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
