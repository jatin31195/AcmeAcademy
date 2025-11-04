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

    Questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    
  },
  { timestamps: true }
);

export default mongoose.model("PracticeTopic", practiceTopicSchema);
