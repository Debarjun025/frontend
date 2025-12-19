import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

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
        {/* NAME */}
        <p><strong>Name:</strong></p>
        <input value={name} readOnly />

        {/* EMAIL */}
        <p style={{ marginTop: 12 }}><strong>Email:</strong></p>
        <input value={email} readOnly />

        {/* PHONE */}
        <p style={{ marginTop: 12 }}><strong>Phone:</strong></p>
        <input value={phone || "-"} readOnly />

        {/* INFO */}
        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.7 }}>
          Email verification is done manually by the Top Admin.
        </p>

        <p style={{ marginTop: 6 }}>
          <strong>Status:</strong>{" "}
          {user.emailVerified ? "Verified ✔" : "Pending verification"}
        </p>
      </div>
    </div>
  );
}
