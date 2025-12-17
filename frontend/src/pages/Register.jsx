import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !pass || !confirmPass)
      return setError("All fields are required.");

    if (pass !== confirmPass)
      return setError("Passwords do not match.");

    if (!agree)
      return setError("You must agree to the rules & guidelines.");

    try {
      const r = await axios.post(API + "/api/auth/register", {
        name,
        email,
        password: pass,
      });

      localStorage.setItem("token", r.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  }

  return (
    <div
      className="container"
      style={{
        maxWidth: 520,
        marginTop: 40,
        padding: 30,
        background: "white",
        borderRadius: 14,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          color: "#3b2311",
          textAlign: "center",
          marginBottom: 20,
          fontWeight: 700,
        }}
      >
        Create Account
      </h2>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#ffe5e5",
            border: "1px solid #ffb3b3",
            color: "#b30000",
            borderRadius: 8,
            marginBottom: 18,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        {/* Name */}
        <label className="muted">Full Name</label>
        <input
          className="input"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <label className="muted" style={{ marginTop: 12 }}>
          Email
        </label>
        <input
          className="input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="muted" style={{ marginTop: 12 }}>
          Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showPass ? "text" : "password"}
            placeholder="Enter password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#8a6f57",
              fontSize: 14,
            }}
          >
            {showPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* Confirm Password */}
        <label className="muted" style={{ marginTop: 12 }}>
          Confirm Password
        </label>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            type={showConfirmPass ? "text" : "password"}
            placeholder="Re-enter password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <span
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#8a6f57",
              fontSize: 14,
            }}
          >
            {showConfirmPass ? "Hide" : "Show"}
          </span>
        </div>

        {/* Checkbox */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 18,
            marginBottom: 10,
          }}
        >
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />

          <label
            style={{ cursor: "pointer", color: "#3b2311" }}
            onClick={() => setAgree(!agree)}
          >
            I agree to the club rules & guidelines
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn"
          style={{
            width: "100%",
            marginTop: 20,
            background: "#c28e45",
            color: "white",
            padding: "12px 0",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
