import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { user, token, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
  }, [user]);

  if (!user) {
    return <div className="container card">Please login first.</div>;
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
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        {/* PHONE */}
        <p style={{ marginTop: 12 }}>
          <strong>Phone:</strong>
        </p>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />

        {/* INFO NOTE */}
        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
          Email verification is done manually by the Top Admin.
        </p>
      </div>
    </div>
  );
}
