import PracticeTopic from "../models/PracticeTopic.js";
import PracticeSet from "../models/PracticeSet.js";

export const createPracticeTopic = async (req, res) => {
  try {
    const { title, description, practiceSetId } = req.body;

    if (!title || !practiceSetId) {
      return res.status(400).json({
        success: false,
        message: "Title and practiceSetId are required",
      });
    }

    const practiceSet = await PracticeSet.findById(practiceSetId);
    if (!practiceSet) {
      return res.status(404).json({
        success: false,
        message: "PracticeSet not found",
      });
    }

    const newTopic = await PracticeTopic.create({
      title,
      description,
      practiceSet: practiceSetId,
    });

    await PracticeSet.findByIdAndUpdate(practiceSetId, {
      $addToSet: { topics: newTopic._id },
    });

    res.status(201).json({
      success: true,
      message: "PracticeTopic created successfully",
      data: newTopic,
    });
  } catch (err) {
    console.error("❌ Error creating PracticeTopic:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating PracticeTopic",
    });
  }
};

// ✅ Get all topics under a practice set
export const getTopicsByPracticeSet = async (req, res) => {
  try {
    const { practiceSetId } = req.params;

    const topics = await PracticeTopic.find({ practiceSet: practiceSetId })
      .populate("Questions") // <-- fixed here
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    console.error("❌ Error fetching topics:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching topics",
    });
  }
};

// ✅ Get topic by its ID
export const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await PracticeTopic.findById(id).populate("Questions"); // <-- fixed here

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (err) {
    console.error("❌ Error fetching topic:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching topic",
    });
  }
};
