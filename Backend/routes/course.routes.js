import express from "express";
import {
  createCourse,
  getUserCourses,
} from "../controllers/course.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCourse);
router.get("/", authMiddleware, getUserCourses);

export default router;
