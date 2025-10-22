import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: { type: String },
  marksObtained: { type: Number, default: 0 },
  timeTaken: { type: Number, default: 0 },
});

const userTestAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  answers: [answerSchema],
  totalTimeTaken: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  attemptNumber: { type: Number, required: true },
  isSubmitted: { type: Boolean, default: false },
});

export default mongoose.model("UserTestAttempt", userTestAttemptSchema);
