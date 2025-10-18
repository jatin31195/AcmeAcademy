import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true, unique: true },
  whatsapp: { type: String },
  testAttempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserTestAttempt",
      },
    ],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
