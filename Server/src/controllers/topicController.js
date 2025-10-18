import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";

// Create a new topic under a subject
export const createTopic = async (req, res) => {
  try {
    const { subjectId, title, locked, links } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const topic = new Topic({ title, subject: subjectId, locked, links });
    const saved = await topic.save();

    subject.topics.push(saved._id);
    await subject.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get topics under a subject
export const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
