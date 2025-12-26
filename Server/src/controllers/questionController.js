import Question from "../models/Question.js";
import PracticeTopic from "../models/PracticeTopic.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
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
      let solutionImageUrl = "";

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "test_solutions",
        });
        fs.unlinkSync(req.file.path);
        solutionImageUrl = result.secure_url;
      } else if (item.solutionImage) {
        solutionImageUrl = item.solutionImage.trim();
      }

      let options = item.options;
      if (typeof options === "string") {
        try {
          options = JSON.parse(options);
        } catch {
          options = [];
        }
      }

      const question = new Question({
        question: item.question,
        options: options || [],
        answer: item.answer,
        solutionText: item.solutionText || "",
        solutionVideo: item.solutionVideo || "",
        solutionImage: solutionImageUrl,
        image: item.image || "",
        tags: item.tags
          ? typeof item.tags === "string"
            ? item.tags.split(",").map((t) => t.trim())
            : item.tags
          : [],
        topic: item.topic || "",
        section: item.section || "",
        practiceTopic: item.practiceTopic,
        slug: slugifyQuestion({ question: item.question }),
      });

      const saved = await question.save();

      if (item.practiceTopic) {
        await PracticeTopic.findByIdAndUpdate(item.practiceTopic, {
          $push: { generalQuestions: saved._id },
        });
      }

      savedQuestions.push(saved);
    }

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} question(s) added successfully`,
      data: savedQuestions,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to add question(s)" });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "test_solutions",
      });
      fs.unlinkSync(req.file.path);
      updateData.solutionImage = result.secure_url;
    }

    if (updateData.options && typeof updateData.options === "string") {
      updateData.options = JSON.parse(updateData.options);
    }
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",").map((t) => t.trim());
    }

    const updated = await Question.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Question not found" });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update question" });
  }
};

export const searchQuestions = async (req, res) => {
  try {
    const { q, topic, section } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (section) filter.section = section;
    const query = q ? { ...filter, $text: { $search: q } } : filter;
    const questions = await Question.find(query).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to search questions" });
  }
};
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    // Remove reference from PracticeTopic if exists
    if (question.practiceTopic) {
      await PracticeTopic.findByIdAndUpdate(question.practiceTopic, {
        $pull: { generalQuestions: id },
      });
    }

    await Question.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete question",
    });
  }
};

export const getAllQuestions = async (req, res) => {
  try {
    const { topic, section } = req.query;
    const filter = {};
    if (topic) filter.topic = topic;
    if (section) filter.section = section;
    const questions = await Question.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch questions" });
  }
};



export const getQuestionsByPracticeTopicAndTopic = async (req, res) => {
  try {
    const { practiceTopicId, topic } = req.params;
    const questions = await Question.find({
      practiceTopic: practiceTopicId,
      topic: new RegExp(`^${topic}$`, "i"),
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch questions by practiceTopic and topic",
    });
  }
};

export const getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const query = { topic: new RegExp(`^${topic}$`, "i") };
    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch questions" });
  }
};

export const getQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const question = await Question.findOne({ slug });
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch question" });
  }
};


export const addDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, comment } = req.body;

    const question = await Question.findById(id);
    if (!question)
      return res.status(404).json({ error: "Question not found" });

    question.discussion.push({ user, comment });
    await question.save();

    res.json({
      success: true,
      message: "Discussion added successfully",
      discussion: question.discussion,
    });
  } catch (err) {
    console.error("❌ Error adding discussion:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to add discussion" });
  }
};


export const getAllTopics = async (req, res) => {
  try {
    const topics = await Question.distinct("topic");
    res.json({ success: true, data: topics });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch topics" });
  }
};
export const getTopicsByPracticeTopic = async (req, res) => {
  try {
    const { practiceTopicId } = req.params;
    const topics = await Question.distinct("topic", { practiceTopic: practiceTopicId });

    res.json({
      success: true,
      count: topics.length,
      data: topics,
    });
  } catch (err) {
    console.error("❌ Error fetching topics by practiceTopic:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch topics by practiceTopic",
    });
  }
};
