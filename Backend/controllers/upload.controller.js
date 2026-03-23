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

    let extractedText = "";
    let processingStatus = "uploaded";
    let processingError = "";

    try {
      extractedText = await parsePDF(req.file.path);

      console.log("---- PDF EXTRACTION DEBUG ----");
      console.log("File:", req.file.originalname);
      console.log("Extracted length:", extractedText?.length || 0);
      console.log("Preview:", extractedText?.slice(0, 1000) || "NO TEXT");
      console.log("------------------------------");

      if (extractedText && extractedText.trim().length > 50) {
        processingStatus = "parsed";
      } else {
        processingStatus = "failed";
        processingError = "Could not extract enough readable text from PDF";
      }
    } catch (parseError) {
      console.error("PDF PARSE ERROR:", parseError.message);
      processingStatus = "failed";
      processingError = "Failed to parse PDF";
    }

    const course = await Course.create({
      title,
      user: userId,
      fileName: req.file.filename,
      extractedText,
      processingStatus,
      processingError,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { courses: course._id },
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      courseId: course._id,
      processingStatus: course.processingStatus,
      processingError: course.processingError,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: error.message });
    }
  }
};
