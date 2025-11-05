import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import prerender from "prerender-node";
import practiceSetRoutes from "./src/routes/practiceSetRoute.js";
import authRoute from "./src/routes/authRoute.js";
import mailRoutes from "./src/routes/mailRoute.js"
import pyqRoute from "./src/routes/pyqRoute.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
import topicRoutes from "./src/routes/topicRoutes.js";
import testRoute from "./src/routes/testRoute.js";
import questionRoutes from "./src/routes/questionRoute.js";
import resultRoutes from "./src/routes/resultRoute.js";
import practiceTopicRoutes from "./src/routes/practiceTopicRoutes.js";
import sitemapRoutes from "./src/routes/sitemap.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* ------------------------- 🔹 Middlewares ------------------------- */
app.use(
  prerender
    .set("prerenderToken", "yd8IUbtERM5oQKILMuBo")
    .set("protocol", "https")
);

app.use(
  cors({
    origin: [
      "http://localhost:5173", // for Vite dev
      "https://acmeacademy.onrender.com", // optional tunnel
    ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

/* ------------------------- 🔹 Routes ------------------------- */
app.use("/api/users", authRoute);
app.use("/api/pyqs", pyqRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/tests", testRoute);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/practice-set", practiceSetRoutes);
app.use("/api/practice-topic", practiceTopicRoutes);
app.use(express.static(path.join(__dirname, "./public")));
app.use("/", sitemapRoutes);
/* ------------------------- 🔹 Root Route ------------------------- */
app.get("/", (req, res) => {
  res.send("🚀 ACME Academy Backend is running!");
});

/* ------------------------- 🔹 Error Handler ------------------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
