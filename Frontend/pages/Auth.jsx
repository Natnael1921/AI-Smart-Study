import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import "../styles/auth.css";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode");

  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });


  useEffect(() => {
    if (modeFromUrl === "register") {
      setMode("register");
    } else {
      setMode("login");
    }
  }, [modeFromUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "login") {
        const res = await API.post("/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful");
      } else {
        await API.post("/api/auth/register", form);
        alert("Registration successful. Please login.");

        setSearchParams({ mode: "login" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
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

        <button type="submit">
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="auth-switch">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setSearchParams({ mode: "register" })}>
                Register
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setSearchParams({ mode: "login" })}>
                Login
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Auth;
