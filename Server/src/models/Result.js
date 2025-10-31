import mongoose from "mongoose";



const resultSchema = new mongoose.Schema(
  {
    name: { type: String },
    exam: { type: String, required: true },
    year: { type: Number },
    rank: { type: Number },
    score: { type: Number },
    photoUrl: { type: String },
    slug: { type: String, unique: true, index: true },
    photoType:{type:String}
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
