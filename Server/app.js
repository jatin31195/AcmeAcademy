import express from "express";
//import forceHttps from "express-force-https";
import cors from "cors";
import cookieParser from "cookie-parser";
import prerender from "prerender-node";
import adminRoutes from "./src/routes/adminRoutes.js"
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
import noticeRoute from "./src/routes/noticeRoute.js"
import practiceTopicRoutes from "./src/routes/practiceTopicRoutes.js";
import homeCourseRoute from "./src/routes/homeCourseRoute.js"
import sitemapRoutes from "./src/routes/sitemap.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production";
const shouldEnforceHttps = isProduction || process.env.FORCE_HTTPS === "true";
const allowedOrigins = [
  "https://www.acmeacademy.in",
  "https://acmeacademy.in",
  "https://admin.acmeacademy.in",
  "https://api.acmeacademy.in",
  "https://acmeacademy.onrender.com",
  "https://acme-academy-rd7v.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const isHttpsRequest = (req) => {
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (Array.isArray(forwardedProto)) {
    return forwardedProto.some((v) => String(v).includes("https"));
  }
  if (typeof forwardedProto === "string") {
    return forwardedProto.split(",").map((v) => v.trim()).includes("https");
  }
  return req.secure;
};

// Required when running behind reverse proxies (Render/Vercel/Nginx/Cloudflare)
// so Express can correctly detect HTTPS via X-Forwarded-* headers.
app.set("trust proxy", 1);
/* ------------------------- 🔹 Middlewares ------------------------- */
//app.use(forceHttps);
//app.use((req, res, next) => {
//  const canonicalHost = "www.acmeacademy.in";
  //if (
    //req.headers.host &&
   // req.headers.host !== canonicalHost &&
   // !req.headers.host.includes("localhost")
  //) {
   // return res.redirect(301, `https://${canonicalHost}${req.originalUrl}`);
 // }
//  next();
//});
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without Origin header (curl, health checks, server-to-server).
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(
  prerender
    .set("prerenderToken", "yd8IUbtERM5oQKILMuBo")
    .set("protocol", "https")
);

// Enforce HTTPS and send strict transport security headers in production.
app.use((req, res, next) => {
  if (shouldEnforceHttps) {
    const isHttps = isHttpsRequest(req);

    if (!isHttps) {
      if (req.path.startsWith("/api/")) {
        return res.status(426).json({
          success: false,
          message: "HTTPS is required for API access.",
        });
      }

      const host = req.headers.host;
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    }

    // Force browsers to always use HTTPS for this domain.
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Basic hardening headers for all environments.
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Sensitive student endpoints should never be cached by browsers/proxies.
app.use(["/api/users", "/api/results", "/api/tests"], (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

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
app.use("/api/get-notices",noticeRoute)
app.use("/api/get-course",homeCourseRoute)
app.use(express.static(path.join(__dirname, "./public")));
app.use("/", sitemapRoutes);
app.use("/api/admin",adminRoutes);
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
