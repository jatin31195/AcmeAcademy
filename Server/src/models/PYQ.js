import mongoose from "mongoose";

const pyqSchema = new mongoose.Schema({
  title: { type: String, required: true },
  exam: { type: String, required: true },
  year: { type: String, required: true },
  description: { type: String },
  pdfUrl: { type: String, required: true }, 
  fileSize: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  questions: { type: Number },
}, { timestamps: true });

export default mongoose.model("PYQ", pyqSchema);
