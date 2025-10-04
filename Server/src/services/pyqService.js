import PYQ from "../models/PYQ.js";

export const getAllPYQs = async (filters = {}) => {
  const query = {};

  if (filters.exam && filters.exam !== "all") query.exam = filters.exam;
  if (filters.year && filters.year !== "all") query.year = filters.year;
  if (filters.search) query.title = { $regex: filters.search, $options: "i" };

  const pyqs = await PYQ.find(query).sort({ year: -1 });
  return pyqs;
};

export const getPYQById = async (id) => {
  const pyq = await PYQ.findById(id);
  if (!pyq) throw new Error("PYQ not found");
  return pyq;
};
export const addPYQ = async (data) => {
  const pyq = new PYQ({
    title: data.title,
    exam: data.exam,
    year: data.year,
    description: data.description || "",
    pdfUrl: data.pdfUrl,
    fileSize: data.fileSize || "",
    difficulty: data.difficulty || "Medium",
    questions: data.questions || 0,
  });
  await pyq.save();
  return pyq;
};
export const addBulkPYQs = async (pyqsArray) => {
  // Validate input is an array
  if (!Array.isArray(pyqsArray) || pyqsArray.length === 0) {
    throw new Error("Input must be a non-empty array of PYQs");
  }

  // Optional: validate each object has required fields
  pyqsArray.forEach((pyq, index) => {
    if (!pyq.title || !pyq.exam || !pyq.year || !pyq.pdfUrl) {
      throw new Error(`PYQ at index ${index} is missing required fields`);
    }
  });

  const inserted = await PYQ.insertMany(pyqsArray);
  return inserted;
};