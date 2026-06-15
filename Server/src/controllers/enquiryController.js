import Enquiry from "../models/Enquiry.js";

/**
 * Admin: list all counselling / contact-us enquiries.
 * Returns the full dataset (newest first); searching, category filtering,
 * sorting and CSV export are handled on the admin client.
 */
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ enquiries });
  } catch (err) {
    console.error("Get enquiries error:", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

/**
 * Admin: delete a single enquiry.
 */
export const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted" });
  } catch (err) {
    console.error("Delete enquiry error:", err);
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};
