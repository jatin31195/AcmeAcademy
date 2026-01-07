import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  title: String,
  marksPerQuestion: Number,
  negativeMarks: Number,
  numQuestions: Number,
  durationMinutes: { type: Number, default: 0 }, // 0 for shared
  durationGroup: { type: String }, // "CE_GROUP"
});
sharedDurationGroups: [
  {
    name: String,          // "CE_GROUP"
    durationMinutes: Number // 20
  }
]


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
  const sectionTime = this.sections.reduce(
    (a, s) => a + (s.durationMinutes || 0),
    0
  );

  const sharedTime = this.sharedDurationGroups?.reduce(
    (a, g) => a + g.durationMinutes,
    0
  ) || 0;

  this.totalDurationMinutes = sectionTime + sharedTime;
  this.totalQuestions = this.sections.reduce((a, s) => a + s.numQuestions, 0);
  this.totalMarks = this.sections.reduce(
    (a, s) => a + s.numQuestions * s.marksPerQuestion,
    0
  );

  next();
});


export default mongoose.model("Test", testSchema);
