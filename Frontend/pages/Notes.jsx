import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function Notes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(true)}
      ></button>
      <h3 style={{ marginLeft: "240px", marginTop: "100px" }}>
        Comming Soon :)
      </h3>
    </div>
  );
}
