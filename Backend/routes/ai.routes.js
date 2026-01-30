import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { generateAIContent } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", authMiddleware, generateAIContent);

export default router;
