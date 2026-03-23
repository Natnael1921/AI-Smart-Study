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
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.extractedText || course.extractedText.trim().length < 50) {
      course.processingStatus = "failed";
      course.processingError = "This course has no usable extracted text";
      await course.save();

      return res.status(400).json({
        message: "This course has no usable extracted text",
      });
    }

    course.processingStatus = "generating";
    course.processingError = "";
    await course.save();

    const extractedText = course.extractedText;

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

    const raw = completion.choices[0].message.content || "";
    console.log("AI RAW RESPONSE:\n", raw);

    const quizBlock = extractBlock(raw, "===QUIZ===", "===END QUIZ===");

    const questions = quizBlock
      .split(/(?:^|\n)Q:/)
      .slice(1)
      .map((q) => {
        const lines = q
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        const question = lines[0];

        const options = lines
          .filter((l) => /^[A-D]\)/.test(l))
          .map((l) => l.replace(/^[A-D]\)\s*/, "").trim());

        const correctAnswer = lines
          .find((l) => l.startsWith("ANSWER:"))
          ?.replace("ANSWER:", "")
          .trim();

        const explanation = lines
          .find((l) => l.startsWith("EXPLANATION:"))
          ?.replace("EXPLANATION:", "")
          .trim();

        if (!question || options.length !== 4 || !correctAnswer) return null;

        return {
          question,
          options,
          correctAnswer,
          explanation: explanation || "",
        };
      })
      .filter(Boolean);

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

    console.log("Questions parsed:", questions.length);
    console.log("Cards parsed:", cards.length);

    if (questions.length === 0 && cards.length === 0) {
      course.processingStatus = "failed";
      course.processingError = "AI returned incomplete content";
      await course.save();

      return res.status(422).json({
        message: "AI returned incomplete content",
      });
    }

    await Quiz.deleteOne({ course: courseId });
    await FlashCard.deleteOne({ course: courseId });

    if (questions.length > 0) {
      await Quiz.create({
        course: courseId,
        questions: questions.slice(0, 25),
      });
    }

    if (cards.length > 0) {
      await FlashCard.create({
        course: courseId,
        cards: cards.slice(0, 15),
      });
    }

    course.processingStatus = "completed";
    course.processingError = "";
    await course.save();

    return res.status(201).json({
      message: "AI content generated successfully",
      quizCount: questions.length,
      flashCardCount: cards.length,
    });
  } catch (err) {
    console.error("AI ERROR:", err);

    if (req.body?.courseId) {
      try {
        await Course.findByIdAndUpdate(req.body.courseId, {
          processingStatus: "failed",
          processingError: err.message,
        });
      } catch (updateErr) {
        console.error("FAILED TO UPDATE COURSE STATUS:", updateErr.message);
      }
    }

    return res.status(500).json({ message: err.message });
  }
};

// GET QUIZ BY COURSE
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

// GET FLASHCARDS BY COURSE
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
