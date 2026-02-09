import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadCard from "../components/UploadCard";
import API from "../api";
import "../styles/Home.css";
import { toast } from "react-toastify";

const Home = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [showTitleBox, setShowTitleBox] = useState(false);

  //  STEP 1: when user chooses PDF
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setTitle(file.name.replace(".pdf", "")); // default nice title
    setShowTitleBox(true);
  };

  //  STEP 2: real upload after title confirm
  const handleConfirmUpload = async () => {
    if (!title.trim() || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);

    const toastId = toast.loading("Uploading & generating content... ");

    try {
      setIsLoading(true);
      setShowTitleBox(false);

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
        render: `Generated ${aiRes.data.quizCount} quizzes & ${aiRes.data.flashCardCount} flashcards`,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Upload failed !",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
      setTitle("");
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

        {/* TITLE INPUT MODAL */}
        {showTitleBox && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Name your course</h3>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 2 – Biology"
              />

              <div className="modal-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setShowTitleBox(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-btn"
                  onClick={handleConfirmUpload}
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
