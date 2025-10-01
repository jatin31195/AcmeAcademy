import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from './src/routes/authRoute.js';
import { getMe } from "./src/utils/me.js";

const app = express();

app.use(cors({
  origin: 'https://54c618dfa4a8.ngrok-free.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", authRoute);
app.use("/api/users/me", getMe);

app.get("/", (req, res) => {
  res.send("ACME Academy Backend is running!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
