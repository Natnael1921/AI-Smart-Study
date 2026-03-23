import { parsePDF } from "../utils/fileParser.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const uploadFile = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user?.id;

    if (!req.file || !title || !userId) {
      return res
        .status(400)
        .json({ message: "File, title or user ID missing" });
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

    const extractedText = await parsePDF(req.file.path);

    if (extractedText) {
      console.log(
        "Extracted Text (first 500 chars):",
        extractedText.slice(0, 500),
      );
    } else {
      console.log("Extracted text is empty or undefined");
    }
    return res.status(201).json({
      courseId: course._id,
      extractedText,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};
