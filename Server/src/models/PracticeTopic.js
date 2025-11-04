import mongoose from "mongoose";

const practiceTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    
    practiceSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PracticeSet",
      required: true,
    },

    generalQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    mathQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: "MathQuestion" }],
  },
  { timestamps: true }
);

export default mongoose.model("PracticeTopic", practiceTopicSchema);
