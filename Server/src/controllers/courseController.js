import Course from "../models/Course.js";
import Subject from "../models/Subject.js";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select("title category exam description type");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single course with its subjects
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("subjects", "title emoji");
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new course
export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
