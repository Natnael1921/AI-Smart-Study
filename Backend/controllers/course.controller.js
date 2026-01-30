import Course from "../models/course.model.js";
import User from "../models/user.model.js";
//CREATE COURSE (Authenticated)

export const createCourse = async (req, res) => {
  try {
    const { title, fileName } = req.body;
    const userId = req.user.id;

    if (!title || !fileName) {
      return res.status(400).json({ message: "Title and file name are required" });
    }

    const course = await Course.create({
      title,
      user: userId,
      fileName,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { courses: course._id },
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

//GET USER COURSES (Authenticated)

export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const courses = await Course.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
