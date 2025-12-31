import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const accessToken = req.cookies?.adminAccessToken;

  // ❌ No access token
  if (!accessToken) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // ✅ Attach admin info
    req.admin = {
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
