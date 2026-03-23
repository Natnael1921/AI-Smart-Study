import groq from "../config/groq.js";
import Course from "../models/course.model.js";
import Quiz from "../models/quiz.model.js";
import FlashCard from "../models/flashcard.model.js";
import { quizAndFlashPrompt } from "../prompts/ai.prompts.js";

const extractBlock = (text, start, end) => {
  const s = text.indexOf(start);
  if (s === -1) return "";

  const startIndex = s + start.length;
  const e = text.indexOf(end, startIndex);

  if (e === -1) {
    return text.substring(startIndex).trim();
  }

  return text.substring(startIndex, e).trim();
};

export const generateAIContent = async (req, res) => {
  try {
    const { extractedText, courseId } = req.body;

    if (!extractedText || !courseId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      max_completion_tokens: 2500,
      messages: [
        {
          role: "user",
          content: quizAndFlashPrompt(extractedText),
        },
      ],
    });

    const raw = completion.choices[0].message.content;

    //  QUIZ BLOCK
    const quizBlock = extractBlock(raw, "===QUIZ===", "===END QUIZ===");

    //  FLASHCARDS (ROBUST)

    const cards = raw
      .split("FRONT:")
      .slice(1)
      .map((block) => {
        const [frontPart, backPart] = block.split("BACK:");
        if (!frontPart || !backPart) return null;

        const cleanBack = backPart.replace(/===END FLASHCARDS===/g, "").trim();

        return {
          front: frontPart.trim(),
          back: cleanBack,
        };
      })
      .filter((c) => c?.front && c?.back);
    //  PARSE QUIZ QUESTIONS
    const questions = quizBlock
      .split(/(?:^|\n)Q:/)
      .slice(1)
      .map((q) => {
        const lines = q.split("\n").map((l) => l.trim());

        const question = lines[0];
        const options = lines
          .filter((l) => /^[A-D]\)/.test(l))
          .map((l) => l.slice(3).trim());

        const correctAnswer = lines
          .find((l) => l.startsWith("ANSWER:"))
          ?.replace("ANSWER:", "")
          .trim();

        const explanation = lines
          .find((l) => l.startsWith("EXPLANATION:"))
          ?.replace("EXPLANATION:", "")
          .trim();

        if (!question || options.length !== 4 || !correctAnswer) return null;

        return { question, options, correctAnswer, explanation };
      })
      .filter(Boolean);

    if (questions.length === 0) {
      return res.status(422).json({
        message: "AI could not generate quiz questions",
      });
    }

    //  SAVE TO DB
    await Quiz.create({
      course: courseId,
      questions: questions.slice(0, 25),
    });

    await FlashCard.create({
      course: courseId,
      cards: cards.slice(0, 15),
    });

    res.status(201).json({
      message: "AI content generated successfully",
      quizCount: questions.length,
      flashCardCount: cards.length,
    });
  } catch (err) {
    console.error(" AI ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//GET QUIZ BY COURSE

export const getQuizByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//GET FLASHCARDS BY COURSE

export const getFlashCardsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const flashCards = await FlashCard.findOne({ course: courseId });

    if (!flashCards) {
      return res.status(404).json({ message: "Flashcards not found" });
    }

    res.json(flashCards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
