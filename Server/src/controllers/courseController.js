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
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    await Course.deleteOne({ _id: id });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCourse)
      return res.status(404).json({ error: "Course not found" });

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
