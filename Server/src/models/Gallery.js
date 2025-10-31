import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    eventName: { type: String }, 
    year: { type: Number }, 
    rank: { type: Number }, 
    slug: { type: String, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
