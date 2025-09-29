import mongoose from "mongoose";
import dotenv from "dotenv";
import { createError } from "../utils/createError.js";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    const error = createError(
      "MongoDB connection failed: " + err.message,
      500,
      "Check your MongoDB URI, network connection, or Atlas cluster"
    );
    console.error("💥 Error occurred:", error);
    process.exit(1); 
  }
};
