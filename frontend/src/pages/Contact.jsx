import React, { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("idle");

  // Replace with your Formspree endpoint:
  const FORMSPREE_URL = "https://formspree.io/f/xblqragw"; // Example; replace with yours

  async function submit(e) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("sent");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311" }}>Contact Us</h2>

      <div className="card" style={{ marginTop: 20 }}>
        <form onSubmit={submit}>
          <label className="muted">Your Name</label>
          <input name="name" placeholder="Enter your name..." required />

          <label className="muted">Email</label>
          <input name="email" type="email" placeholder="your@email.com" required />

          <label className="muted">Message</label>
          <textarea name="message" rows={6} placeholder="Type your message..." required />

          <button className="btn" type="submit">
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          {status === "sent" && (
            <div className="info" style={{ marginTop: 10 }}>
              ✓ Message sent successfully!
            </div>
          )}
          {status === "error" && (
            <div className="error" style={{ marginTop: 10 }}>
              Something went wrong. Try again later.
            </div>
          )}
        </form>
      </div>

      {/* Club Contact Details */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Club Contact Details</h3>
        <p className="muted">Feel free to reach out anytime.</p>

        <p><strong>Email:</strong> vivekanandaboysclub48@gmail.com</p>
        <p><strong>Phone:</strong> +91 8918745483</p>
        <p><strong>Address:</strong> 9GR4+3VW, Krishnanagar, West Bengal - 741102</p>
      </div>

      {/* MAP SECTION */}
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Find Us on Map</h3>

        <div style={{ marginTop: 12 }}>
          <iframe
            title="BBC Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d384.91459601684977!2d88.50674215594499!3d23.390192050063906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f9210066087793%3A0x1177d6264aeb27cb!2sVivekananda%20Boys%20Club!5e0!3m2!1sen!2sin!4v1764655835591!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{
              border: "0",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
