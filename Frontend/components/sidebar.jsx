import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-group">
          <img
            src="/appLogo.png"
            alt="Smart Study Logo"
            className="sidebar-logo-img"
          />
          <h2 className="sidebar-logo">Smart-Study</h2>
        </div>

        <button className="sidebar-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav>
        <NavLink to="/home">
          <img src="/icons/home.svg" alt="Home" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/courses">
          <img src="/icons/courses.png" alt="Courses" />
          <span>Courses</span>
        </NavLink>

        <NavLink to="/notes">
          <img src="/icons/notes.png" alt="Notes" />
          <span>Notes</span>
        </NavLink>

        <NavLink to="/quizzes">
          <img src="/icons/quiz.png" alt="Quizzes" />
          <span>Quizzes</span>
        </NavLink>

        <NavLink to="/flashcards">
          <img src="/icons/flashcards.png" alt="Flashcards" />
          <span>Flashcards</span>
        </NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
