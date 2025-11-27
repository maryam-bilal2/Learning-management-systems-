import Course from "../model/course.model.js";

// Debug controller - return all courses (including unpublished)
export const getAllCoursesDebug = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("educator", "name email avatar")
      .populate("chapters")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Debug getAllCourses error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
