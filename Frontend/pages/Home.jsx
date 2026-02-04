import { useState } from "react";
import Sidebar from "../components/sidebar";
import UploadCard from "../components/UploadCard";
import API from "../api";
import "../styles/home.css";

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
      const res = await API.post("/api/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("File uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      alert("Upload failed");
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
