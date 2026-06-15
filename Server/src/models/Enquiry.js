import mongoose from "mongoose";

/**
 * Stores every counselling / contact-us form submission so the data is not
 * lost if the notification email fails, and so admins can browse it later.
 * `subject` holds the query type (counselling, course, admission, feedback, ...)
 * and is treated as the "category" in the admin panel.
 */
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    center: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, default: "" }, // query type / category
    message: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
