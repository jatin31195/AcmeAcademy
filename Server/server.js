import app from "./app.js";
import { connectDB } from "./src/config/db.js";
import  errorHandler  from "./src/middlewares/errormiddleware.js";
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
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => errorHandler(err, null, { status: () => {} }, () => {}));

