import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCountryCode(user.countryCode || "+91");
  }, [user]);

  if (!user)
    return <div className="container card">Please login first.</div>;

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Profile</h2>

      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <p><strong>Name:</strong></p>
        <input value={name} disabled />

        <p style={{ marginTop: 12 }}><strong>Email:</strong></p>
        <input value={email} disabled />

        <p style={{ marginTop: 12 }}><strong>Phone:</strong></p>
        <input value={`${countryCode} ${phone}`} disabled />

        <p style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}>
          Phone & Email verification is done manually by the Top Admin.
        </p>
      </div>
    </div>
  );
}
