import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  emoji: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

export default mongoose.model("Subject", subjectSchema);
