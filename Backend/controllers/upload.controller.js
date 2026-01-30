import { parsePDF } from "../utils/fileParser.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const uploadFile = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    if (!req.file || !title) {
      return res.status(400).json({ message: "File and title are required" });
    }

    // 1. Create course
    const course = await Course.create({
      title,
      user: userId,
      fileName: req.file.filename,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { courses: course._id },
    });

    // 2. Extract text
    const extractedText = await parsePDF(req.file.path);

    res.status(201).json({
      courseId: course._id,
      extractedText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message } );
  }
};
