import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/auth.css";
import Spinner from "../components/Spinner";
const Auth = ({ setUser }) => {
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const modeFromUrl = searchParams.get("mode");

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    setMode(modeFromUrl === "register" ? "register" : "login");
  }, [modeFromUrl]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await API.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);

        navigate("/home");
      } else {
        await API.post("/api/auth/register", form);
        alert("Registration successful. Please login.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>

        {mode === "register" && (
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {loading ? (
          <Spinner />
        ) : (
          <button type="submit">
            {mode === "login" ? "Login" : "Register"}
          </button>
        )}
      </form>
    </div>
  );
};

export default Auth;
