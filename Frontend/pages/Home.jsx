import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadCard from "../components/UploadCard";
import API from "../api";
import "../styles/Home.css";
import { toast } from "react-toastify";
import { BookOpen, NotebookPen, Layers3, Upload } from "lucide-react";

const Home = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [showTitleBox, setShowTitleBox] = useState(false);

  const stats = [
    { id: 1, title: "Total Courses", value: "8", icon: BookOpen },
    { id: 2, title: "Notes Generated", value: "24", icon: NotebookPen },
    { id: 3, title: "Flashcards Created", value: "132", icon: Layers3 },
    { id: 4, title: "Uploads", value: "11", icon: Upload },
  ];

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setTitle(file.name.replace(".pdf", ""));
    setShowTitleBox(true);
  };

  const handleConfirmUpload = async () => {
    if (!title.trim() || !selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);

    const toastId = toast.loading("Uploading & generating content...");

    try {
      setIsLoading(true);
      setShowTitleBox(false);

      const token = localStorage.getItem("token");

      const res = await API.post("/api/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { courseId, processingStatus, processingError } = res.data;

      if (processingStatus === "failed") {
        throw new Error(processingError || "PDF parsing failed");
      }

      const aiRes = await API.post(
        "/api/ai/generate",
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      toast.update(toastId, {
        render: `Generated ${aiRes.data.quizCount} quizzes & ${aiRes.data.flashCardCount} flashcards`,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Upload failed!",
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

        <section className="topbar-section">
          <div className="topbar-left">
            <p className="greeting">Hi, {user?.name || "User"}</p>
            <h1 className="home-title">Welcome back to your smart workspace</h1>
          </div>

          <div className="topbar-right">
            <p className="topbar-badge">Stay consistent</p>
          </div>
        </section>

        <section className="stats-grid">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div className="stat-card" key={item.id}>
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <div className="stat-info">
                  <p>{item.title}</p>
                  <h3>{item.value}</h3>
                </div>
              </div>
            );
          })}
        </section>

        <section className="upload-section">
          <div className="upload-section-text">
            <span className="mini-badge">Quick Start</span>
            <h2>Turn your PDF into powerful study materials</h2>
            <p>
              Upload your course file and generate organized notes, quizzes, and
              flashcards in one smooth workflow.
            </p>

            <div className="upload-points">
              <span>Smart notes</span>
              <span>Quiz generation</span>
              <span>Flashcards</span>
            </div>
          </div>

          <div className="upload-section-card">
            <UploadCard onUpload={handleUpload} isLoading={isLoading} />
          </div>
        </section>

        {showTitleBox && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>Name your course</h3>
              <p className="modal-subtext">
                Choose a clean title so you can find it easily later.
              </p>

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
                <button className="primary-btn" onClick={handleConfirmUpload}>
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
