import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  generateAIContent,
  getQuizByCourse,
  getFlashCardsByCourse,
} from "../controllers/ai.controller.js";

const router = express.Router();
// CREATE
router.post("/generate", authMiddleware, generateAIContent);

// READ
router.get("/quiz/:courseId", authMiddleware, getQuizByCourse);
router.get("/flashcards/:courseId", authMiddleware, getFlashCardsByCourse);
export default router;
