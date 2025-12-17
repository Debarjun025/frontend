import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-wrapper">

      {/* HERO SECTION */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: "url('/logo.png')", // <-- Replace with your image
        }}
      >
        <div className="hero-overlay">
          <h1 className="hero-title">Bivekananda Boy's Club</h1>
          <p className="hero-subtitle">
            Celebrating Saraswati, Kartik & Gopal Puja with devotion and unity.
          </p>

          <div className="hero-buttons">
            <Link to="/chanda" className="hero-btn">
              Donate Chanda
            </Link>
            <Link to="/members" className="hero-btn-outline">
              View Members
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">
        <h2 className="section-title">Our Events</h2>

        <div className="card-grid">
          <div className="card card-festival">
            <h3>Saraswati Puja</h3>
            <p>
              Our flagship celebration, Saraswati Puja, is observed every year with heartfelt devotion, enriching cultural performances, and enthusiastic involvement from the entire community.
            </p>
          </div>

          <div className="card card-festival">
            <h3>Kartik Puja</h3>
            <p>
              A cherished tradition of worship and illumination, celebrated with vibrant energy and deep togetherness at BBC.
            </p>
          </div>

          <div className="card card-festival">
            <h3>Gopal Puja</h3>
            <p>
              A joyful event that brings our community together every year through devotion and lively cultural performances.
            </p>
          </div>
        </div>

        <h2 className="section-title" style={{ marginTop: 35 }}>
          What You Can Do
        </h2>

        <div className="card-grid">
          <div className="card">
            <h3>Donate Chanda</h3>
            <p className="muted">
              Support our club by donating online using UPI QR and uploading
              your payment screenshot.
            </p>
            <Link to="/chanda" className="mini-btn">Donate →</Link>
          </div>

          <div className="card">
            <h3>View Members</h3>
            <p className="muted">
              See the list of club members and their roles in managing events.
            </p>
            <Link to="/members" className="mini-btn">Members →</Link>
          </div>

          <div className="card">
            <h3>Social Media</h3>
            <p className="muted">
              Follow important updates, announcements, and photos.
            </p>
            <Link to="/social" className="mini-btn">Social →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
