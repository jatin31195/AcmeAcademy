import mongoose from "mongoose";
import dotenv from "dotenv";
import { createError } from "../utils/createError.js";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    // Do NOT kill the process here. If we exit, the whole HTTP server goes
    // down and EVERY endpoint returns 502 — including routes that don't need
    // Mongo at all (e.g. /api/config/firebase and /api/otp for the rank
    // predictor). Log loudly and let the caller keep the server listening.
    const error = createError(
      "MongoDB connection failed: " + err.message,
      500,
      "Check your MONGO_URI and that MongoDB Atlas → Network Access allows this server's IP (use 0.0.0.0/0 for Render)."
    );
    console.error("💥 MongoDB connection error:", error.message, "—", error.reason);
    throw err; // surfaced to the caller, which logs but keeps serving
  }
};
