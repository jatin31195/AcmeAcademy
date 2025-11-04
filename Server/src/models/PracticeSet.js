import mongoose from "mongoose";

const practiceSetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },

    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "PracticeTopic" }],
  },
  { timestamps: true }
);

export default mongoose.model("PracticeSet", practiceSetSchema);
