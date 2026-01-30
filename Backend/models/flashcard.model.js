import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  front: String,
  back: String,
});

const flashCardSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    cards: [cardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("FlashCard", flashCardSchema);
