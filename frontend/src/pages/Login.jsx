import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const API = import.meta.env.VITE_API_URL || "";

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!email.includes("@")) return setErr("Enter a valid email.");
    if (password === "") return setErr("Password cannot be empty.");

    setLoading(true);

    try {
      const res = await axios.post(API + "/api/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      nav("/profile");
    } catch (err) {
      setErr(err.response?.data?.error || "Invalid credentials.");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom: 10 }}>Sign In</h2>

        {err && (
          <div className="error" style={{ marginBottom: 12 }}>
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="muted">Email</label>
          <input
            value={email}
            placeholder="your@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="muted">Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Show/Hide Password Button */}
            <span
              onClick={() => setShow(!show)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                color: "rgba(0,0,0,0.5)",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: 15,
            textAlign: "center",
            fontSize: 14,
          }}
        >
        </div>
      </div>
    </div>
  );
}
