import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import "../styles/notes.css";

export default function Notes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="notes-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="notes-content">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="coming-soon">
          <h2>Notes Coming Soon !</h2>
        </div>
      </main>
    </div>
  );
}
