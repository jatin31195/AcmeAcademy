import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from './src/routes/authRoute.js';
import { getMe } from "./src/utils/me.js";
import pyqRoute from './src/routes/pyqRoute.js'
import courseRoutes from "./src/routes/courseRoutes.js";
import subjectRoutes from "./src/routes/subjectRoutes.js";
import topicRoutes from "./src/routes/topicRoutes.js";
import testRoute from "./src/routes/testRoute.js"
import questionRoutes from "./src/routes/questionRoute.js";

const app = express();

app.use(cors({
  origin: ['https://7a40b29474d2.ngrok-free.app','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", authRoute);
app.use("/api/users/me", getMe);
app.use("/api/pyqs",pyqRoute);
app.use("/api/courses", courseRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/tests",testRoute );
app.use("/api/questions", questionRoutes);
app.get("/", (req, res) => {
  res.send("ACME Academy Backend is running!");
});
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,             
}));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
