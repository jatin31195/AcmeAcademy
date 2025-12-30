import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies?.adminToken;
  const sessionToken = req.cookies?.adminSession;

  // ❌ Missing cookies
  if (!token || !sessionToken) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ❌ Session mismatch → logout on refresh protection
    if (decoded.sessionToken !== sessionToken) {
      return res.status(401).json({ message: "Admin session expired" });
    }

    // ✅ Attach admin data (whatever you stored in token)
    req.admin = {
      email: decoded.email,
      sessionToken: decoded.sessionToken,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
