import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  marksPerQuestion: { type: Number, required: true },
  negativeMarks: { type: Number, default: 0 },       
  numQuestions: { type: Number, required: true },    
  durationMinutes: { type: Number, required: true }, 
});

const solutionSchema = new mongoose.Schema({
  text: { type: String },           
  images: [{ type: String }], 
  videoLink: { type: String },        
});

const questionSchema = new mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  solution: solutionSchema,         
});

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    sections: [sectionSchema],
    questions: [questionSchema],
    totalAttempts: { type: Number, default: 5 },

   
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    totalDurationMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);


testSchema.pre("save", function (next) {
  if (this.sections && this.sections.length > 0) {
    this.totalQuestions = this.sections.reduce((acc, s) => acc + s.numQuestions, 0);
    this.totalMarks = this.sections.reduce(
      (acc, s) => acc + s.numQuestions * s.marksPerQuestion,
      0
    );
    this.totalDurationMinutes = this.sections.reduce(
      (acc, s) => acc + s.durationMinutes,
      0
    );
  }
  next();
});

export default mongoose.model("Test", testSchema);
