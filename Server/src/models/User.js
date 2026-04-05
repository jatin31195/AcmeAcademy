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
    phone: {
      type: String,
      default: "",
      trim: true,
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

    verificationProfileSubmitted: {
      type: Boolean,
      default: false,
    },
    verificationProfileLocked: {
      type: Boolean,
      default: false,
    },
    verificationSubmittedAt: {
      type: Date,
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationProfile: {
      mobile: { type: String, default: "", trim: true },
      address: { type: String, default: "", trim: true },
      targetExam: { type: String, default: "", trim: true },
      targetExams: [{ type: String, trim: true }],
      targetYear: { type: Number, default: null },
      courseEnrolled: { type: String, default: "", trim: true },
      batchesEnrolled: { type: String, default: "", trim: true },
      fatherName: { type: String, default: "", trim: true },
      motherName: { type: String, default: "", trim: true },
      parentsContact: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      idType: { type: String, default: "", trim: true },
      idFrontUrl: { type: String, default: "" },
      idBackUrl: { type: String, default: "" },
      marksheetUrl: { type: String, default: "" },
      latestPhotoUrl: { type: String, default: "" },
      passportPhotoUrl: { type: String, default: "" },
      applicationForms: [
        {
          exam: { type: String, trim: true },
          fileUrl: { type: String, default: "" },
        },
      ],
      livePhotoDataUrl: { type: String, default: "" },
      signatureDataUrl: { type: String, default: "" },
      termsAccepted: { type: Boolean, default: false },
      termsAcceptedAt: { type: Date, default: null },
      downloadProfileCardDataUrl: { type: String, default: "" },
    },

    activityLogs: [
      {
        action: { type: String, required: true, trim: true },
        message: { type: String, default: "", trim: true },
        meta: { type: mongoose.Schema.Types.Mixed, default: {} },
        at: { type: Date, default: Date.now },
      },
    ],


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
