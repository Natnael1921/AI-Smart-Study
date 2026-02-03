import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import aiRoutes from "./routes/ai.routes.js";


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Quiz AI Backend Running Successfully");
});
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai", aiRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
