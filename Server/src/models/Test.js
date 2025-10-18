import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  marks: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },
});

const questionSchema = new mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  solutionImages: [{ type: String }],
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  sections: [sectionSchema],
  questions: [questionSchema],
  totalAttempts: { type: Number, default: 5 },
  durationMinutes: { type: Number, required: true },
});

export default mongoose.model("Test", testSchema);
