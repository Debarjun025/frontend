import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate("/");
  }

  const isAdmin = user && (user.role === "admin" || user.role === "top-admin");
  const isTop = user && user.role === "top-admin";

  const navLinkStyle = {
    color: "#ffdca8",
    textDecoration: "none",
    fontWeight: 500,
    padding: "6px 8px",
    transition: "0.25s",
  };

  const navLinkHover = {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 6,
  };

  return (
    <nav
      className="navbar"
      style={{
        background: "linear-gradient(90deg, #3b2311, #5a2d0c)",
        padding: "14px 0",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          maxWidth: 1150,
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          <Link to="/" style={{ ...navLinkStyle, fontSize: 22 }}>
            Bivekananda Boy's Club
          </Link>
        </div>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>

          <Link to="/chanda" style={navLinkStyle}>
            Chanda
          </Link>

          <Link to="/members" style={navLinkStyle}>
            Members
          </Link>

          <Link to="/social" style={navLinkStyle}>
            Social
          </Link>

          <Link to="/contact" style={navLinkStyle}>
            Contact
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              style={{ ...navLinkStyle, borderBottom: "2px solid #ffdca8" }}
            >
              Admin Panel
            </Link>
          )}

          {isTop && (
            <Link
              to="/top-admin"
              style={{
                ...navLinkStyle,
                background: "#ffdca8",
                color: "#3b2311",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 600,
              }}
            >
              Top Admin
            </Link>
          )}

          {isTop && (
            <Link
              to="/super-admin-reset"
              style={{
                ...navLinkStyle,
                background: "#ffdca8",
                color: "#3b2311",
                borderRadius: 6,
                padding: "6px 12px",
                fontWeight: 600,
              }}
            >
              Top reset
            </Link>
          )}

          {user ? (
            <>
              <Link to="/profile" style={navLinkStyle}>
                {user.name?.split(" ")[0] || "Profile"}
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  border: "1px solid #ffdca8",
                  padding: "6px 10px",
                  borderRadius: 6,
                  color: "#ffdca8",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "0.25s",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>
                Login
              </Link>
              <Link to="/register" style={navLinkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
