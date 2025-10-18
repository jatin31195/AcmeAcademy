import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  locked: {
    assignment: { type: Boolean, default: false },
    test: { type: Boolean, default: false },
  },
  links: {
    notes: { type: String },
    lecture: { type: String },
    assignment: { type: String },
  },
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
});

export default mongoose.model("Topic", topicSchema);
