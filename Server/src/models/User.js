import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    
    whatsapp: {
      type: String,
      default: "",
    },

    
    profilePic: {
      type: String, 
      default: "",
    },
    fatherName: {
      type: String,
      default: "",
      trim: true,
    },
    collegeName: {
      type: String,
      default: "",
      trim: true,
    },
    nimcetApplicationId: {
      type: String,
      default: "",
      trim: true,
    },
    targetExam: {
      type: String,
      default: "",
      trim: true,
    },
    targetYear: {
      type: Number, 
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null,
    },


    testAttempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserTestAttempt",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
