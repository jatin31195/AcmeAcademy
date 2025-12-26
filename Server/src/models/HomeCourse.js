import mongoose from "mongoose";

const homeCourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    mode: { type: String },

    courseType: { type: String }, 

    icon: { type: String },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("HomeCourse", homeCourseSchema);
