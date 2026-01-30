import { groq } from "../config/groq.js";
import {
  shortNotesPrompt,
  quizPrompt,
  flashCardPrompt,
} from "../prompts/ai.prompts.js";
import ShortNote from "../models/ShortNote.js";
import Quiz from "../models/Quiz.js";
import FlashCard from "../models/FlashCard.js";

const safeParseJson = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

export const generateAIContent = async (req, res) => {
  try {
    const { extractedText, courseId } = req.body;

    if (!extractedText || !courseId) {
      return res.status(400).json({ message: "Text and courseId are required" });
    }

    const model = "llama-3.3-70b-versatile";

    const notesRes = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: shortNotesPrompt(extractedText) }],
    });

    const quizRes = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: quizPrompt(extractedText) }],
    });

    const flashRes = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: flashCardPrompt(extractedText) }],
    });

    const notesData = safeParseJson(notesRes.choices[0].message.content);
    const quizData = safeParseJson(quizRes.choices[0].message.content);
    const flashData = safeParseJson(flashRes.choices[0].message.content);

    if (!notesData || !quizData || !flashData) {
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    const shortNotes = await ShortNote.create({
      course: courseId,
      chapters: notesData.chapters,
    });

    const quiz = await Quiz.create({
      course: courseId,
      questions: quizData.questions,
    });

    const flashCards = await FlashCard.create({
      course: courseId,
      cards: flashData.cards,
    });

    res.status(201).json({
      message: "AI content generated and saved",
      shortNotesId: shortNotes._id,
      quizId: quiz._id,
      flashCardsId: flashCards._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
