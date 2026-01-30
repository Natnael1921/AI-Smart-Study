import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const shortNoteSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    chapters: [chapterSchema],
  },
  { timestamps: true }
);

export default mongoose.model("ShortNote", shortNoteSchema);
