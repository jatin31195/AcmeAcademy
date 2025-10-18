import Subject from "../models/Subject.js";
import Course from "../models/Course.js";

// Create new subject under a course
export const createSubject = async (req, res) => {
  try {
    const { courseId, title, emoji } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const subject = new Subject({ title, emoji, course: courseId });
    const saved = await subject.save();

    course.subjects.push(saved._id);
    await course.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all subjects under a course
export const getSubjectsByCourse = async (req, res) => {
  try {
    const subjects = await Subject.find({ course: req.params.courseId }).select("title emoji");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single subject with topics
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("topics");
    if (!subject) return res.status(404).json({ error: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
