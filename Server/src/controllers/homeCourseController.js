import HomeCourse from "../models/HomeCourse.js";

export const addHomeCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      mode,
      courseType, 
      exams,     
      link,
    } = req.body;

    
    let icon = "BookOpen";
    if (courseType === "live") icon = "Laptop";
    if (courseType === "recorded") icon = "Clock";

    const course = new HomeCourse({
      title,
      description,
      duration,
      mode,
      courseType,
      exams,
      icon,
      link,
    });

    await course.save();

    res.status(201).json({
      message: "Home course added successfully",
      course,
    });
  } catch (err) {
    console.error("Add course error:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
};


export const deleteHomeCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await HomeCourse.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await HomeCourse.deleteOne({ _id: id });

    res.status(200).json({
      message: "Home course deleted successfully",
    });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
export const getHomeCourses = async (req, res) => {
  try {
    const courses = await HomeCourse.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};