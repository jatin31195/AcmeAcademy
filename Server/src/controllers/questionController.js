import Question from "../models/Question.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";


export const searchQuestions = async (req, res) => {
  const { q, subject, topic, section } = req.query;
  try {
    const filter = {};
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (section) filter.section = section;

    let questions;
    if (q) {
      questions = await Question.find({ ...filter, $text: { $search: q } }).limit(50);
    } else {
      questions = await Question.find(filter).limit(50);
    }
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getQuestionsByTopic = async (req, res) => {
  const { topic } = req.params;
  try {
        const { subject, topic } = req.params;
    const query = { topic };
    if (subject) query.subject = subject;

    const questions = await Question.find(query);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getAllQuestions = async (req, res) => {
  const { subject, topic, section } = req.query;
  try {
    const filter = {};
    if (subject) filter.subject = subject;
    if (topic) filter.topic = topic;
    if (section) filter.section = section;

    const questions = await Question.find(filter).limit(200);
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const addDiscussion = async (req, res) => {
  const { id } = req.params;
  const { user, comment } = req.body;
  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.discussion.push({ user, comment });
    await question.save();
    res.json(question.discussion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const addQuestion = async (req, res) => {
  try {
    let solutionImageUrl = "";

    // 🖼️ Upload file if attached
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "test_solutions",
      });

      fs.unlinkSync(req.file.path); // cleanup local temp file
      solutionImageUrl = result.secure_url;
    } else if (req.body.solutionImage) {
      solutionImageUrl = req.body.solutionImage.trim();
    }

    // 🧩 Parse options field safely
    let options = req.body.options;
    if (typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch (err) {
        console.warn("⚠️ Could not parse options JSON:", err.message);
        options = [];
      }
    }

    const newQuestion = new Question({
      question: req.body.question,
      options,
      answer: req.body.answer,
      solutionText: req.body.solutionText || "",
      solutionVideo: req.body.solutionVideo || "",
      solutionImage: solutionImageUrl,
      image: req.body.image || "",
      subject: req.body.subject,
      topic: req.body.topic,
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("❌ Error in addQuestion:", err);
    res.status(500).json({ error: err.message || "Something went wrong!" });
  }
};




export const getQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let question = await Question.findOne({ slug });
    if (!question) {
      question = await Question.findOne({
        question: { $regex: new RegExp(`^${slug}$`, "i") }
      });
    }

    if (!question)
      return res.status(404).json({ error: "Question not found" });

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};



export const getTopicsBySubject = async (req, res) => {
  const { subject } = req.params;
  try {
    const topics = await Question.distinct("topic", { subject });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Question.distinct("subject");
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
