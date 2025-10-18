import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  exam: { type: String, required: true },
  description: { type: String },
  topicsCount: { type: Number },
  type: { type: String, default: "Course" },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

export default mongoose.model("Course", courseSchema);
