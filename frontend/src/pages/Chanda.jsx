import React, { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";

export default function Chanda() {
  const [names, setNames] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const [qrImg, setQrImg] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "";
  const UPI = import.meta.env.VITE_UPI_ID || "debarjunpaul9@okhdfcbank";

  // Generate QR instantly
  async function generateQR(newAmount) {
    if (!newAmount || newAmount <= 0) {
      setQrImg("");
      return;
    }

    setQrLoading(true);

    const upiLink = `upi://pay?pa=${UPI}&pn=BBC Saraswati Club&am=${newAmount}&cu=INR`;

    try {
      const img = await QRCode.toDataURL(upiLink, { width: 450 });
      setQrImg(img);
    } catch {
      alert("Failed to generate QR");
    }

    setQrLoading(false);
  }

  async function submit(e) {
    e.preventDefault();

    if (!names || !amount || !file)
      return alert("Please fill all fields & upload screenshot");

    const fd = new FormData();
    fd.append("donor_names", names);
    fd.append("amount", amount);
    fd.append("category", category);
    fd.append("message", message);
    fd.append("payment_mode", "Online");
    fd.append("screenshot", file);

    try {
      await axios.post(API + "/api/chanda/submit", fd);
      alert("Donation submitted! Thank you💖");

      setNames("");
      setAmount("");
      setMessage("");
      setCategory("General");
      setFile(null);
      setQrImg("");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  const floating = {
    position: "relative",
    marginBottom: "20px",
  };

  const labelStyle = {
    position: "absolute",
    top: "-10px",
    left: "10px",
    background: "#fff",
    padding: "0 6px",
    fontSize: "13px",
    color: "#6a4b2f",
    fontWeight: "600",
  };

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311", marginBottom: 10, fontWeight: 900 }}>
        Donate / Chanda Collection
      </h2>

      <div className="chanda-grid">
        {/* LEFT SIDE - FORM */}
        <div
          className="card"
          style={{
            padding: "28px",
            borderRadius: "18px",
            backdropFilter: "blur(5px)",
          }}
        >
          <h3 style={{ marginBottom: 15 }}>Donation Details</h3>

          <form onSubmit={submit}>
            {/* Floating Inputs */}
            <div style={floating}>
              <label style={labelStyle}>Donor Name(s)</label>
              <input
                value={names}
                onChange={(e) => setNames(e.target.value)}
                placeholder=" "
                className="smooth-input"
              />
            </div>

            <div style={floating}>
              <label style={labelStyle}>Amount (₹)</label>
              <input
                value={amount}
                type="number"
                min="1"
                placeholder=" "
                className="smooth-input"
                onChange={(e) => {
                  setAmount(e.target.value);
                  generateQR(e.target.value);
                }}
              />
            </div>

            <div style={floating}>
              <label style={labelStyle}>Festival Category</label>
              <select
                value={category}
                className="smooth-input"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Saraswati">Saraswati Puja</option>
                <option value="Kartik">Kartik Puja</option>
                <option value="Gopal">Gopal Puja</option>
              </select>
            </div>

            <div style={floating}>
              <label style={labelStyle}>Message (Optional)</label>
              <textarea
                value={message}
                placeholder=" "
                rows={3}
                className="smooth-input"
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={floating}>
              <label style={labelStyle}>Upload Payment Screenshot</label>
              <input
                type="file"
                className="smooth-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button
              className="btn"
              type="submit"
              style={{
                padding: "12px",
                fontSize: "16px",
                borderRadius: "10px",
                fontWeight: 700,
                marginTop: 10,
              }}
            >
              Submit Donation
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - QR UI */}
        <div
          className="card"
          style={{
            padding: 28,
            borderRadius: 18,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Instant QR Payment</h3>
          <p className="muted" style={{ marginTop: -5 }}>
            QR updates automatically as you enter amount.
          </p>

          {qrLoading && <p className="muted">Generating...</p>}

          {qrImg && (
            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                animation: "fadeIn 0.5s ease",
              }}
            >
              <div
                style={{
                  padding: 16,
                  background: "rgba(255, 245, 230, 0.7)",
                  borderRadius: 16,
                  border: "2px solid #d1a05f",
                  boxShadow: "0 6px 15px rgba(209,160,95,0.25)",
                }}
              >
                <img
                  src={qrImg}
                  alt="QR code"
                  style={{
                    width: 250,
                    borderRadius: 16,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                <button className="mini-btn" onClick={() => navigator.clipboard.writeText(UPI)}>
                  Copy UPI
                </button>

                <button className="mini-btn" onClick={() => {
                  const a = document.createElement("a");
                  a.href = qrImg;
                  a.download = `bbc_upi_${amount}.png`;
                  a.click();
                }}>
                  Download QR
                </button>

                <a
                  href={`upi://pay?pa=${UPI}&pn=BBC Saraswati Club&am=${amount}&cu=INR`}
                  className="mini-btn"
                >
                  Pay Now
                </a>
              </div>

              <div className="muted" style={{ marginTop: 12 }}>
                UPI ID: <b>{UPI}</b>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyframe Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }

          .smooth-input {
            width: 100%;
            padding: 12px;
            border-radius: 10px;
            border: 1px solid rgba(0,0,0,0.1);
            background: #fff;
            transition: 0.2s;
            font-size: 15px;
          }

          .smooth-input:focus {
            outline: none;
            border-color: #d1a05f;
            box-shadow: 0 0 6px rgba(209,160,95,0.45);
          }
        `}
      </style>
    </div>
  );
}
