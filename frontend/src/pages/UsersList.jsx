// src/pages/UsersList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

export default function UsersList() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (!user || user.role !== "top-admin") {
      setErr("Access denied. Only Top Admin can view this page.");
      return;
    }

    loadUsers();
  }, [user]);

  async function loadUsers() {
    try {
      const res = await axios.get(API + "/api/admin/all-users", {
        headers: { Authorization: "Bearer " + token },
      });
      setUsers(res.data.users || []);
    } catch (e) {
      setErr("Failed to load users.");
    }
  }

  async function changeRole(id, role) {
    try {
      await axios.post(
        API + "/api/admin/promote",
        { id, role },
        { headers: { Authorization: "Bearer " + token } }
      );
      loadUsers();
    } catch (e) {
      alert("Role update failed");
    }
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.post(
        API + "/api/admin/delete-user",
        { id },
        { headers: { Authorization: "Bearer " + token } }
      );
      loadUsers();
    } catch (e) {
      alert("Delete failed");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  if (err)
    return (
      <div className="container">
        <div className="error">{err}</div>
      </div>
    );

  return (
    <div className="container">
      <h2 style={{ color: "#3b2311", marginBottom: 20 }}>All Registered Users</h2>

      {/* Search Box */}
      <input
        style={{
          padding: 10,
          width: "100%",
          maxWidth: 400,
          borderRadius: 10,
          border: "1px solid #d1a05f",
          marginBottom: 20,
        }}
        placeholder="Search by name, email or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card" style={{ padding: 20, overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 15,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#d1a05f",
                color: "white",
              }}
            >
              <th style={{ padding: 8 }}>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Email Verified</th>
              <th>Phone Verified</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 6 }}>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || "-"}</td>

                {/* Role Badge */}
                <td>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      color: "white",
                      background:
                        u.role === "top-admin"
                          ? "#8b0000"
                          : u.role === "admin"
                          ? "#0055aa"
                          : "#777",
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td>{u.email_verified ? "✔" : "❌"}</td>
                <td>{u.phone_verified ? "✔" : "❌"}</td>

                <td style={{ display: "flex", gap: 8 }}>
                  {/* Promote */}
                  {u.role === "user" && (
                    <button
                      onClick={() => changeRole(u.id, "admin")}
                      className="mini-btn"
                      style={{ background: "#0066cc" }}
                    >
                      Promote
                    </button>
                  )}

                  {/* Demote */}
                  {u.role === "admin" && (
                    <button
                      onClick={() => changeRole(u.id, "user")}
                      className="mini-btn"
                      style={{ background: "#aa5500" }}
                    >
                      Demote
                    </button>
                  )}

                  {/* Delete */}
                  {u.role !== "top-admin" && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="mini-btn"
                      style={{ background: "#cc0000" }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p style={{ marginTop: 20, textAlign: "center", opacity: 0.6 }}>
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
