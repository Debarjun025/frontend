import React, { useState } from "react";
import axios from "axios";

export default function SuperAdminReset() {
  const [key, setKey] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const API = import.meta.env.VITE_API_URL || "";

  async function handleReset(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!key || !newEmail || !newPassword)
      return setErr("Please fill all fields");

    try {
      const r = await axios.post(API + "/api/super-admin/reset", {
        key,
        newEmail,
        newPassword,
      });
      setMsg("Super Admin reset successful!");
      setKey("");
      setNewEmail("");
      setNewPassword("");
    } catch (e) {
      setErr(e.response?.data?.error || "Error resetting admin");
    }
  }

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Super Admin Reset</h2>

      <div className="card" style={{ maxWidth: 500 }}>
        {err && <div className="error">{err}</div>}
        {msg && <div className="info">{msg}</div>}

        <form onSubmit={handleReset}>
          <label>Super Admin Key</label>
          <input
            type="password"
            placeholder="Enter Master Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <label style={{ marginTop: 12 }}>New Top Admin Email</label>
          <input
            type="email"
            placeholder="newadmin@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <label style={{ marginTop: 12 }}>New Top Admin Password</label>
          <input
            type="password"
            placeholder="Strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="btn" style={{ marginTop: 14 }} type="submit">
            Reset Top Admin
          </button>
        </form>
      </div>
    </div>
  );
}
