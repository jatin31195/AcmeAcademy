import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const accessToken = req.cookies?.adminAccessToken;

  // ❌ No access token
  if (!accessToken) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // 🔐 A valid signature is NOT enough — user tokens share the same secret.
    // Require the admin role claim AND that the email matches the configured
    // admin account, so a regular user's token can never pass as admin.
    if (decoded.role !== "admin" || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    // ✅ Attach admin info
    req.admin = {
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
