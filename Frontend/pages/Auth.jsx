import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/auth.css";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

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
        toast.success("Login successful!");
        navigate("/home");
      } else {
        await API.post("/api/auth/register", form);
        toast.success("Registration successful! Please login now.");
        setMode("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
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

          <p className="auth-toggle">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setMode("register")}>Register</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setMode("login")}>Sign in</span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
