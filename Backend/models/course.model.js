import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    processingStatus: {
      type: String,
      enum: ["uploaded", "parsed", "generating", "completed", "failed"],
      default: "uploaded",
    },
    processingError: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Course", courseSchema);
