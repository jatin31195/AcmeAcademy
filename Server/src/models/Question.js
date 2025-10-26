import mongoose from "mongoose";
import { slugifyQuestion } from "../utils/slugify.js";


const discussionSchema = new mongoose.Schema({
  user: String,
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const subQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: String,
  solutionText: String,
  solutionVideo: String,
  image: String,
  tags: [String],
  topic: String,
  subQuestions: [
    new mongoose.Schema(
      {
        question: { type: String, required: true },
        options: [String],
        answer: String,
        solutionText: String,
        solutionVideo: String,
        image: String,
        tags: [String],
        topic: String,
      },
      { _id: false }
    ),
  ],
}, { _id: false });


const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: String,
  solutionText: String,
  solutionVideo: String,
  image: String,
  tags: [String],
  subject: { type: String, required: true }, 
  topic: { type: String, required: true },  
  section: { type: String },                
  slug: { type: String, index: true, unique: true, sparse: true },
  discussion: [discussionSchema],
  subQuestions: [subQuestionSchema],
}, { timestamps: true });


questionSchema.pre("save", function(next) {
  if (!this.slug && this.question) {
    this.slug = slugifyQuestion(this);
  }
  next();
});


questionSchema.index({
  question: "text",
  solutionText: "text",
  tags: "text",
  topic: "text",
});

export default mongoose.model("Question", questionSchema);
