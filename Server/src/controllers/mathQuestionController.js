import MathQuestion from "../models/MathQuestion.js";
import { slugifyQuestion } from "../utils/slugify.js";


export const addQuestion = async (req, res) => {
  try {
    const data = Array.isArray(req.body)
    ? req.body
    : req.body.questions
    ? req.body.questions
    : [req.body];

    const savedQuestions = [];

    for (const item of data) {
      const {
        question,
        options,
        answer,
        solutionText,
        solutionVideo,
        tags,
        subject,
        topic,
        section,
      } = item;

      const newQuestion = new MathQuestion({
        question,
        options: typeof options === "string" ? JSON.parse(options) : options || [],
        answer,
        solutionText,
        solutionVideo,
        solutionImage: req.file ? req.file.path : "",
        tags: tags ? (typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags) : [],
        subject: subject || "Mathematics",
        topic,
        section,
        slug: slugifyQuestion({ question }),
      });

      const saved = await newQuestion.save();
      savedQuestions.push(saved);
    }

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} question(s) added successfully`,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Error adding question(s):", error);
    res.status(500).json({ success: false, error: "Failed to add question(s)" });
  }
};


export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) updateData.solutionImage = req.file.path;
    if (updateData.options && typeof updateData.options === "string") {
      updateData.options = JSON.parse(updateData.options);
    }
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((t) => t.trim());
    }

    const updated = await MathQuestion.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Question not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ success: false, error: "Failed to update question" });
  }
};


export const searchQuestions = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q
      ? { $text: { $search: q } }
      : {}; 

    const questions = await MathQuestion.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error searching questions:", error);
    res.status(500).json({ success: false, error: "Failed to search questions" });
  }
};


export const getAllQuestions = async (req, res) => {
  try {
    const questions = await MathQuestion.find().sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching all questions:", error);
    res.status(500).json({ success: false, error: "Failed to fetch questions" });
  }
};


export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await MathQuestion.aggregate([
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: "$subject",
          firstId: { $first: "$_id" },
        },
      },
      { $sort: { firstId: 1 } },
      { $project: { _id: 0, subject: "$_id" } },
    ]);

    const orderedSubjects = subjects.map((s) => s.subject);
    res.json({ success: true, data: orderedSubjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ success: false, error: "Failed to fetch subjects" });
  }
};


export const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const topics = await MathQuestion.aggregate([
      {
        $match: {
          subject: { $regex: `^${subject}$`, $options: "i" },
        },
      },
      {
        $sort: { _id: 1 }, // ✅ ensures topics appear in insertion order
      },
      {
        $group: {
          _id: "$topic",
          firstId: { $first: "$_id" },
        },
      },
      {
        $sort: { firstId: 1 },
      },
      {
        $project: { _id: 0, topic: "$_id" },
      },
    ]);

    const orderedTopics = topics.map((t) => t.topic);

    res.json({ success: true, data: orderedTopics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch topics" });
  }
};


export const getQuestionsByTopic = async (req, res) => {
  try {
    const { subject, topic } = req.params;
    const questions = await MathQuestion.find({
      subject: new RegExp(`^${subject}$`, "i"),
      topic: new RegExp(`^${topic}$`, "i"),
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error fetching questions by topic:", error);
    res.status(500).json({ success: false, error: "Failed to fetch questions" });
  }
};

export const getQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const question = await MathQuestion.findOne({ slug });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ success: true, data: question });
  } catch (error) {
    console.error("Error fetching question by slug:", error);
    res.status(500).json({ success: false, error: "Failed to fetch question" });
  }
};
