import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";
import OtpInput from "../components/OtpInput";

export default function Profile() {
  const { user, token, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [otpStep, setOtpStep] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  if (!user) {
    return <div className="container card">Please login first.</div>;
  }

  /* ================== REQUEST OTP (EMAIL ONLY) ================== */
  async function requestVerify(type, target) {
    setErr("");
    setMsg("");

    if (!target) return setErr("Field cannot be empty.");

    if (type === "email" && !target.includes("@")) {
      return setErr("Enter a valid email.");
    }

    setLoading(true);

    try {
      await axios.post(
        API + "/api/auth/request-verify",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (type === "email") {
        setOtpStep("email");
        setMsg("OTP has been sent to your email.");
      }

      if (type === "phone") {
        login({ ...user, phone: target }, token);
        setMsg("Phone updated!");
      }
    } catch (e) {
      setErr(e.response?.data?.error || "Error sending OTP.");
    }

    setLoading(false);
  }

  /* ================== VERIFY OTP ================== */
  async function verify() {
    setErr("");
    setMsg("");

    if (otp.length !== 6) {
      return setErr("OTP must be 6 digits.");
    }

    setLoading(true);

    try {
      await axios.post(
        API + "/api/auth/verify-otp",
        { code: otp },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      setMsg("Email verified successfully!");
      setOtpStep(null);
      setOtp("");

      login(
        {
          ...user,
          name,
          email,
          phone,
        },
        token
      );
    } catch (e) {
      setErr(e.response?.data?.error || "Invalid OTP.");
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Profile</h2>

      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        {err && <div className="error">{err}</div>}
        {msg && <div className="info">{msg}</div>}

        {/* NAME */}
        <p>
          <strong>Name:</strong>
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        {/* EMAIL */}
        <p style={{ marginTop: 12 }}>
          <strong>Email:</strong>
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ flex: 1 }}
          />
          <button
            className="mini-btn"
            onClick={() => requestVerify("email", email)}
            disabled={loading}
          >
            Verify
          </button>
        </div>

        {/* PHONE */}
        <p style={{ marginTop: 12 }}>
          <strong>Phone:</strong>
        </p>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => requestVerify("phone", phone)}
          placeholder="Phone number"
        />

        {/* OTP BOX */}
        {otpStep === "email" && (
          <div
            className="otp-box"
            style={{
              background: "rgba(0,0,0,0.03)",
              padding: 15,
              borderRadius: 10,
              marginTop: 18,
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: 6 }}>
              Enter OTP for email
            </h4>

            <OtpInput value={otp} onChange={setOtp} />

            <button
              className="btn"
              style={{ marginTop: 12 }}
              onClick={verify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Apply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
