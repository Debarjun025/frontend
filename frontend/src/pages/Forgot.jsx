import React, { useState } from "react";
import axios from "axios";
import OtpInput from "../components/OtpInput";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  // 🔹 Send OTP
  async function send() {
    setErr("");

    if (!email.includes("@")) {
      return setErr("Enter a valid email address.");
    }

    setLoading(true);
    try {
      await axios.post(API + "/api/auth/forgot", { email });
      setStep(1);
    } catch (e) {
      setErr(e.response?.data?.error || "Something went wrong.");
    }
    setLoading(false);
  }

  // 🔹 Verify OTP & Reset Password
  async function verify() {
    setErr("");

    if (otp.length !== 6) return setErr("OTP must be 6 digits.");
    if (newPass.length < 6)
      return setErr("Password must be at least 6 characters.");

    setLoading(true);
    try {
      await axios.post(API + "/api/auth/forgot/verify", {
        email,
        code: otp,
        newPassword: newPass,
      });
      setStep(2);
    } catch (e) {
      setErr(e.response?.data?.error || "Invalid OTP or server error.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom: 10 }}>Reset Password</h2>

        {err && (
          <div className="error" style={{ marginBottom: 12 }}>
            {err}
          </div>
        )}

        {/* STEP 1 → Enter Email */}
        {step === 0 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <label className="muted">Email</label>
            <input
              value={email}
              placeholder="your@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 → Enter OTP + New Password */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verify();
            }}
          >
            <label className="muted">Enter OTP</label>
            <OtpInput value={otp} onChange={setOtp} />

            <label className="muted">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
            />

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Reset"}
            </button>
          </form>
        )}

        {/* STEP 3 → Done */}
        {step === 2 && (
          <div className="muted" style={{ textAlign: "center" }}>
            <b>Password changed successfully.</b>
            <br />
            <a href="/login" style={{ color: "#8b5a2b" }}>
              Go to Login →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
