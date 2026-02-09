import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadCard from "../components/UploadCard";
import API from "../api";
import "../styles/Home.css";

const Home = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      const token = localStorage.getItem("token");

      // 1 Upload PDF
      const res = await API.post("/api/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { courseId, extractedText } = res.data;
      console.log("Upload Response:", res.data);

      // 2 Call AI endpoint
      const cleanText = extractedText.replace(/\u0000/g, ""); // remove null chars
      const aiRes = await API.post(
        "/api/ai/generate",
        { courseId, extractedText: cleanText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      
      alert(
        `AI generated ${aiRes.data.quizCount} questions & ${aiRes.data.flashCardCount} flashcards`,
      );
    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.data);
        alert("Upload failed: " + err.response.data.message);
      } else {
        console.error("Unknown error:", err);
        alert("Upload failed: " + err.message);
      }
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
          <h2>Hi, {user?.name || "User"} </h2>
        </div>

        <h1 className="home-text">
          <span>Welcome Back</span>, Time to grind
        </h1>
        <p className="subtitle">Upload your files to get your helpers</p>

        <UploadCard onUpload={handleUpload} />
      </main>
    </div>
  );
};

export default Home;
