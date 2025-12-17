import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Social() {
  // Toggle this to true if you want to show YouTube later
  const showYouTube = false;

  const socials = [
    {
      name: "Facebook",
      link: "https://www.facebook.com/vivekanandaofficial2010",
      icon: <FaFacebookF size={22} />,
      color: "#1877f2",
    },
    {
      name: "Instagram",
      link: "https://www.instagram.com/vivekanandaboysclub/",
      icon: <FaInstagram size={22} />,
      color: "#e4405f",
    },
    showYouTube && {
      name: "YouTube",
      link: "https://youtube.com/",
      icon: <FaYoutube size={22} />,
      color: "#ff0000",
    },
  ].filter(Boolean); // removes false entries

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311", marginBottom: 12 }}>Social</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "18px",
                transition: "0.25s",
                borderLeft: `5px solid ${s.color}`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: s.color,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {s.icon}
              </div>

              <div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#3b2311" }}>
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.6,
                    marginTop: 2,
                  }}
                >
                  Visit our official {s.name} page
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
