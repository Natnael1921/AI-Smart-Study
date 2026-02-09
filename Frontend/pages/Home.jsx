import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadCard from "../components/UploadCard";
import API from "../api";
import "../styles/Home.css";
import { toast } from "react-toastify";

const Home = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);

  const toastId = toast.loading("Uploading & generating content... ");

  try {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.post("/api/upload", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { courseId, extractedText } = res.data;

    const cleanText = extractedText.replace(/\u0000/g, "");
    const aiRes = await API.post(
      "/api/ai/generate",
      { courseId, extractedText: cleanText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.update(toastId, {
      render: `Generated ${aiRes.data.quizCount} quizzes & ${aiRes.data.flashCardCount} flashcards `,
      type: "success",
      isLoading: false,
      autoClose: 4000,
    });
  } catch (err) {
    toast.update(toastId, {
      render:
        err.response?.data?.message || "Upload failed !",
      type: "error",
      isLoading: false,
      autoClose: 4000,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="home-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="home-content">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <div className="home-header">
          <h2>Hi, {user?.name || "User"}</h2>
        </div>

        <h1 className="home-text">
          <span>Welcome Back</span>, Time to grind
        </h1>

        <p className="subtitle">Upload your files to get your helpers</p>

        <UploadCard onUpload={handleUpload} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Home;
