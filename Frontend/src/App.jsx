import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Landing from "../pages/Landing";
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import ProtectedRoute from "../components/ProtectedRoute";
import Courses from "../pages/Courses";

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) return JSON.parse(storedUser);
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {!user && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth setUser={setUser} />} />

        {/* Protected route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <Home user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute user={user}>
              <Courses />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
