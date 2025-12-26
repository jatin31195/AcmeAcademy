import * as pyqService from "../services/pyqService.js";
import { uploadToCloudinary } from "../utils/multerCloudinary.js";

export const getPYQs = async (req, res) => {
  try {
    const { exam, year, search } = req.query;
    const pyqs = await pyqService.getAllPYQs({ exam, year, search });
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPYQ = async (req, res) => {
  try {
    const pyq = await pyqService.getPYQById(req.params.id);
    res.json(pyq);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const addPYQController = async (req, res) => {
  try {
    const { title, exam, year, description, fileSize, difficulty, questions } = req.body;

    if (!title || !exam || !year)
      return res.status(400).json({ message: "Title, exam and year are required" });

    if (!req.file)
  return res.status(400).json({ message: "File is required" });

const pdfUrl = await uploadToCloudinary(req.file.path, "pyqs");

    const newPYQ = await pyqService.addPYQ({
      title,
      exam,
      year,
      description,
      pdfUrl,
      fileSize,
      difficulty,
      questions,
    });

    res.status(201).json(newPYQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addBulkPYQController = async (req, res) => {
  try {
    const pyqsMeta = JSON.parse(req.body.meta); 
    const files = req.files;

    if (!Array.isArray(pyqsMeta) || !files || files.length === 0)
      return res.status(400).json({ message: "Invalid bulk upload data" });

    if (pyqsMeta.length !== files.length)
      return res.status(400).json({ message: "Meta and file count mismatch" });

    const pyqsToInsert = [];

    for (let i = 0; i < files.length; i++) {
      const pdfUrl = await uploadToCloudinary(files[i].path, "pyqs");

      pyqsToInsert.push({
        ...pyqsMeta[i],
        pdfUrl,
      });
    }

    const inserted = await pyqService.addBulkPYQs(pyqsToInsert);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
