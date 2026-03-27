import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo-group">
        <img
          src="/appLogo.png"
          alt="Smart Study Logo"
          className="sidebar-logo-img"
        />
        <h2 className="sidebar-logo">Smart Study</h2>
      </div>
      <div className="navbar-actions">
        <button
          className="btn-outline"
          onClick={() => navigate("/auth?mode=login")}
        >
          Login
        </button>

        <button
          className="btn-primary"
          onClick={() => navigate("/auth?mode=register")}
        >
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
