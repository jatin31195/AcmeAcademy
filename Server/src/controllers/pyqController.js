
import * as pyqService from "../services/pyqService.js";


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
    const { title, exam, year, description, pdfUrl, fileSize, difficulty, questions } = req.body;

    // Simple validation
    if (!title || !exam || !year || !pdfUrl) {
      return res.status(400).json({ message: "Title, exam, year, and pdfUrl are required" });
    }

    const newPYQ = await pyqService.addPYQ({ title, exam, year, description, pdfUrl, fileSize, difficulty, questions });
    res.status(201).json(newPYQ);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addBulkPYQController = async (req, res) => {
  try {
    const pyqs = req.body; 
    const inserted = await pyqService.addBulkPYQs(pyqs);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};