import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        AI Quiz
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
