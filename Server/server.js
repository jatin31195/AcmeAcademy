import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 💪",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Start the HTTP server FIRST, independent of the database. This guarantees
// the process stays up and keeps serving CORS + DB-free routes (health,
// /api/config/firebase, /api/otp) even if MongoDB is temporarily unreachable —
// instead of a total 502 outage.
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

// Connect to MongoDB in the background. A failure here no longer crashes the
// server; DB-backed routes will surface their own errors per request.
connectDB().catch((err) => {
  console.error(
    "⚠️  Server is running WITHOUT a database connection. DB-backed routes " +
    "will fail until MongoDB is reachable. Reason:",
    err?.message
  );
});

