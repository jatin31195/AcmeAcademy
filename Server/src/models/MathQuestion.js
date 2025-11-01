import mongoose from "mongoose";
import { slugifyQuestion } from "../utils/slugify.js";


const discussionSchema = new mongoose.Schema({
  user: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});


const optionSchema = new mongoose.Schema(
  {
    text: { type: String },
    image: { type: String },
  },
  { _id: false }
);


const mathQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [mongoose.Schema.Types.Mixed], default: [] }, 
    answer: { type: String },
    solutionText: { type: String },
    solutionVideo: { type: String },
    solutionImage: { type: String },
    image: { type: String },
    tags: [String],
    subject: { type: String, required: true, default: "Mathematics" },
    topic: { type: String, required: true },
    section: { type: String },
    slug: { type: String, index: true, unique: true, sparse: true },
    discussion: [discussionSchema],
  },
  { timestamps: true }
);


mathQuestionSchema.pre("save", function (next) {
  if (!this.slug && this.question) {
    this.slug = slugifyQuestion(this);
  }
  next();
});

mathQuestionSchema.index({
  question: "text",
  solutionText: "text",
  tags: "text",
  topic: "text",
});


export default mongoose.model("MathQuestion", mathQuestionSchema);
