import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";
import {
  Home as HomeIcon,
  BookOpen,
  FileText,
  ClipboardList,
  Layers
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const menuItems = [
    { to: "/home", label: "Home", icon: <HomeIcon size={20} /> },
    { to: "/courses", label: "Courses", icon: <BookOpen size={20} /> },
    { to: "/notes", label: "Notes", icon: <FileText size={20} /> },
    { to: "/quizzes", label: "Quizzes", icon: <ClipboardList size={20} /> },
    { to: "/flashcards", label: "Flashcards", icon: <Layers size={20} /> },
  ];

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
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;