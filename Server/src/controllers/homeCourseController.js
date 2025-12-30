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

    // 🎯 icon mapping (optional, clean)
    let icon = "BookOpen";
    if (courseType === "live") icon = "Laptop";
    if (courseType === "recorded") icon = "Clock";
    if (courseType === "live-recorded") icon = "Video";

    const course = await HomeCourse.create({
      title,
      description,
      duration,
      mode,
      courseType,
      exams: Array.isArray(exams) ? exams : [],
      icon,
      link,
    });

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
export const updateHomeCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      mode,
      courseType,
      exams,
      link,
    } = req.body;

    const course = await HomeCourse.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // update fields only if provided
    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (duration !== undefined) course.duration = duration;
    if (mode !== undefined) course.mode = mode;
    if (courseType !== undefined) course.courseType = courseType;
    if (exams !== undefined)
      course.exams = Array.isArray(exams) ? exams : [];
    if (link !== undefined) course.link = link;

    // update icon if courseType changes
    if (courseType) {
      let icon = "BookOpen";
      if (courseType === "live") icon = "Laptop";
      if (courseType === "recorded") icon = "Clock";
      if (courseType === "live-recorded") icon = "Video";
      course.icon = icon;
    }

    await course.save();

    res.status(200).json({
      message: "Home course updated successfully",
      course,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
};