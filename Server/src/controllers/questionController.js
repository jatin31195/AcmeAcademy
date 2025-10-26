import Question from "../models/Question.js";


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
    const questions = await Question.find({ topic });
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
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};


export const getQuestionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const question = await Question.findOne({ slug });
    if (!question) return res.status(404).json({ error: "Question not found" });
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
    res.json({ subject, topics });
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
