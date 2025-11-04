import PracticeSet from "../models/PracticeSet.js";

export const createPracticeSet = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

   
    const existing = await PracticeSet.findOne({ title });
    if (existing) {
      return res.status(400).json({ success: false, message: "PracticeSet with this title already exists" });
    }

    const newSet = new PracticeSet({ title, description });
    await newSet.save();

    res.status(201).json({
      success: true,
      message: "PracticeSet created successfully",
      data: newSet,
    });
  } catch (err) {
    console.error("❌ Error creating PracticeSet:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating PracticeSet",
    });
  }
};


export const getAllPracticeSets = async (req, res) => {
  try {
    const sets = await PracticeSet.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sets.length,
      data: sets,
    });
  } catch (err) {
    console.error("❌ Error fetching PracticeSets:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching PracticeSets",
    });
  }
};


export const getPracticeSetById = async (req, res) => {
  try {
    const { id } = req.params;

    const set = await PracticeSet.findById(id).populate("topics");

    if (!set) {
      return res.status(404).json({ success: false, message: "PracticeSet not found" });
    }

    res.status(200).json({
      success: true,
      data: set,
    });
  } catch (err) {
    console.error("❌ Error fetching PracticeSet:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching PracticeSet",
    });
  }
};
