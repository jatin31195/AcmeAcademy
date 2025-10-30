import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  eventName: { type: String },
  year: { type: Number },
  slug: { type: String, index: true },
});

const resultSchema = new mongoose.Schema(
  {
    name: { type: String },
    exam: { type: String, required: true },
    year: { type: Number },
    rank: { type: Number },
    score: { type: Number },
    photoUrl: { type: String },
    slug: { type: String, unique: true, index: true },
    galleryImages: [gallerySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
