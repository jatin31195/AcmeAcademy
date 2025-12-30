import Topic from "../models/Topic.js";
import Subject from "../models/Subject.js";

export const createTopic = async (req, res) => {
  try {
    const { subjectId, title, locked, links } = req.body;

    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ error: "Subject not found" });

    const topic = new Topic({
      title,
      subject: subjectId,
      locked,
      links,
    });

    const saved = await topic.save();

    subject.topics.push(saved._id);
    await subject.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getTopicsBySubject = async (req, res) => {
  try {
    const topics = await Topic.find({ subject: req.params.subjectId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTopic)
      return res.status(404).json({ error: "Topic not found" });

    res.json(updatedTopic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    const topic = await Topic.findById(id);
    if (!topic) return res.status(404).json({ error: "Topic not found" });

    // remove topic reference from subject
    await Subject.findByIdAndUpdate(topic.subject, {
      $pull: { topics: id },
    });

    await Topic.deleteOne({ _id: id });

    res.json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
