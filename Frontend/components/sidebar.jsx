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
      <h2 className="sidebar-logo">AI Quiz</h2>

      <nav>
        <NavLink to="/home"> Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/notes"> Notes</NavLink>
        <NavLink to="/quizzes"> Quizzes</NavLink>
        <NavLink to="/flashcards"> Flashcards</NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <button className="sidebar-close" onClick={onClose}>
        ✕
      </button>
    </aside>
  );
};

export default Sidebar;
